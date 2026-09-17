export default function Button({ variant = 'primary', loading = false, disabled, children, className = '', ...props }) {
  const classes = ['ui-button', `ui-button-${variant}`, className].filter(Boolean).join(' ');
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="ui-spinner" aria-hidden="true" />}
      <span style={loading ? { visibility: 'hidden' } : undefined}>{children}</span>
    </button>
  );
}
