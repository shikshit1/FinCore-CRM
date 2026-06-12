import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, '../../uploads');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const customerId = req.customerId || 'temp';
    const dir = path.join(uploadsRoot, 'customers', customerId);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80);
    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype) || file.mimetype === 'application/pdf';
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images and PDF files are allowed'));
};

export const customerDocumentUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export { uploadsRoot };
