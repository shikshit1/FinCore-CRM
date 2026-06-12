import { useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-4xl',
  full: 'max-w-[min(96vw,72rem)]',
};

/**
 * Global modal — renders via portal on document.body with proper overlay, z-index, and scroll lock.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  panelClassName = '',
  bodyClassName = '',
}) {
  const panelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const timer = requestAnimationFrame(() => {
      const el = panelRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
    });
    return () => cancelAnimationFrame(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-modal-overlay"
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'relative z-10 flex w-full flex-col',
          'max-h-[min(90vh,calc(100dvh-2rem))]',
          'rounded-xl border border-gray-200 dark:border-slate-700',
          'bg-white dark:bg-slate-900',
          'shadow-2xl dark:shadow-black/50',
          'animate-modal-panel',
          SIZE_CLASSES[size] || SIZE_CLASSES.md,
          panelClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex-shrink-0 flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-xl">
            <div className="min-w-0 flex-1 pr-2">
              {title && (
                <h2 id={titleId} className="text-xl font-bold text-gray-900 dark:text-slate-100 truncate">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
                aria-label="Close dialog"
              >
                <X size={22} />
              </button>
            )}
          </div>
        )}

        <div
          className={[
            'flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-4',
            'text-gray-700 dark:text-slate-300',
            bodyClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>

        {footer != null && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
