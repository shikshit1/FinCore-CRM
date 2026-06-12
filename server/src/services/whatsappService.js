/**
 * WhatsApp messaging via Twilio or Meta WhatsApp Cloud API.
 * Set WHATSAPP_PROVIDER=twilio|meta in .env (defaults to simulated when unset).
 */

const formatPhoneE164 = (phone) => {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;
  return digits.startsWith('+') ? phone : `+${digits}`;
};

const getProvider = () => {
  const provider = (process.env.WHATSAPP_PROVIDER || '').toLowerCase();
  if (provider === 'twilio' && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return 'twilio';
  }
  if (provider === 'meta' && process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return 'meta';
  }
  return 'simulated';
};

const sendViaTwilio = async (to, body) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

  const toWhatsApp = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  const fromWhatsApp = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const params = new URLSearchParams({
    To: toWhatsApp,
    From: fromWhatsApp,
    Body: body,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Twilio WhatsApp send failed');
  }
  return { externalId: data.sid, provider: 'twilio' };
};

const sendViaMeta = async (to, body) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const toDigits = to.replace(/\D/g, '');

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toDigits,
        type: 'text',
        text: { body },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'WhatsApp Cloud API send failed');
  }
  return { externalId: data.messages?.[0]?.id, provider: 'meta' };
};

export const sendWhatsAppMessage = async (phone, message) => {
  const formatted = formatPhoneE164(phone);
  if (!formatted) {
    return { success: false, provider: 'none', error: 'Invalid phone number' };
  }

  const provider = getProvider();

  if (provider === 'simulated') {
    console.log(`[WhatsApp Simulated] To: ${formatted}\n${message}`);
    return {
      success: true,
      provider: 'simulated',
      externalId: `sim_${Date.now()}`,
      simulated: true,
    };
  }

  try {
    const result =
      provider === 'twilio'
        ? await sendViaTwilio(formatted, message)
        : await sendViaMeta(formatted, message);

    return { success: true, provider: result.provider, externalId: result.externalId };
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    return { success: false, provider, error: error.message };
  }
};

export { formatPhoneE164, getProvider };
