export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-sm text-slate-600"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600"
        aria-hidden="true"
      />
      {label ? <span>{label}</span> : null}
    </div>
  );
}
