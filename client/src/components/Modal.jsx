import Modal from './ui/Modal';

/** @deprecated Prefer importing from `./ui/Modal` directly. Kept for legacy callers with submit footer. */
export default function LegacyModal({ isOpen, title, children, onClose, onSubmit, submitText = 'Submit' }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
          >
            {submitText}
          </button>
        </div>
      }
    >
      {children}
    </Modal>
  );
}
