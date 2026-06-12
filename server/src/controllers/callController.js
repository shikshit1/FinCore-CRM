import Call from '../models/Call.js';

const parseDurationToSeconds = (duration) => {
  if (!duration) return 0;
  const parts = String(duration).split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
};

const formatSeconds = (totalSeconds) => {
  if (!totalSeconds) return '0:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getAllCalls = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status && status !== 'all') query.callStatus = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { telecallerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const calls = await Call.find(query).sort({ createdAt: -1 }).limit(200);
    res.json({ calls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCall = async (req, res) => {
  try {
    const call = new Call({
      ...req.body,
      loggedBy: req.user.userId,
    });
    await call.save();
    res.status(201).json({ message: 'Call logged successfully', call });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCallAnalytics = async (req, res) => {
  try {
    const calls = await Call.find().sort({ createdAt: -1 });

    const totalCalls = calls.length;
    const connectedCalls = calls.filter(
      c => ['connected', 'interested', 'follow-up-required'].includes(c.callStatus)
    ).length;
    const leadsGenerated = calls.filter(c => c.leadGenerated).length;
    const followupsPending = calls.filter(
      c => c.followUpDate && new Date(c.followUpDate) >= new Date() && c.callStatus === 'follow-up-required'
    ).length;

    const durations = calls.map(c => parseDurationToSeconds(c.duration)).filter(d => d > 0);
    const avgSeconds = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    res.json({
      totalCalls,
      connectedCalls,
      connectionRatio: totalCalls ? `${Math.round((connectedCalls / totalCalls) * 100)}%` : '0%',
      leadsGenerated,
      conversionRatio: connectedCalls
        ? `${Math.round((leadsGenerated / connectedCalls) * 100)}%`
        : '0%',
      avgDuration: formatSeconds(avgSeconds),
      followupsPending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
