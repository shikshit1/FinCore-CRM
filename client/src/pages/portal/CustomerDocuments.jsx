import { useEffect, useState } from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { portalService } from '../../services/apiService';
import { Upload, FileText, ExternalLink } from 'lucide-react';

const DOC_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'salary_slip', label: 'Salary Slip' },
  { value: 'other', label: 'Other Document' },
];

export default function CustomerDocuments() {
  const [documents, setDocuments] = useState([]);
  const [kycStatus, setKycStatus] = useState('pending');
  const [docType, setDocType] = useState('aadhaar');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocs = () => {
    portalService.getDocuments().then(d => {
      setDocuments(d.documents || []);
      setKycStatus(d.kycStatus || 'pending');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      await portalService.uploadDocument(docType, file);
      setFile(null);
      e.target.reset?.();
      fetchDocs();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const docLabel = (type) => DOC_TYPES.find(d => d.value === type)?.label || type;

  return (
    <PortalLayout title="Documents" subtitle="Upload KYC and income documents">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="fincore-card p-6">
          <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" /> Upload Document
          </h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Document Type</label>
              <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">File (PDF, JPG, PNG — max 5MB)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
                required
              />
            </div>
            <button type="submit" disabled={uploading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-4">KYC Status: <span className="font-medium capitalize">{kycStatus}</span></p>
        </div>

        <div className="fincore-card p-6">
          <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Uploaded Documents</h2>
          {loading ? (
            <p className="text-gray-500 dark:text-slate-400 text-sm">Loading...</p>
          ) : documents.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 text-sm">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-400" />
                    <div>
                      <p className="font-medium text-sm">{docLabel(doc.docType)}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{doc.originalName || doc.fileName}</p>
                      <span className="text-xs capitalize text-gray-400">{doc.status} · {doc.uploadedAt && new Date(doc.uploadedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                  {doc.url && (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
