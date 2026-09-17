export default function Modal({ open, onClose, title, children, closeOnBackdrop = true }) {
  if (!open) return null;
  return (
    <div className="ui-modal-backdrop" onClick={closeOnBackdrop ? onClose : undefined}>
      <div className="ui-modal" onClick={(e) => e.stopPropagation()}>
        {(title || onClose) && (
          <div className="ui-modal-header">
            {title && <h2 className="ui-modal-title">{title}</h2>}
            {onClose && (
              <button className="ui-modal-close" onClick={onClose} aria-label="Close">
                <img src="/images/close.png" alt="" />
              </button>
            )}
          </div>
        )}
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  );
}
