export function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-lg border border-slate-200 bg-white p-4"
      aria-hidden="true"
    >
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-6 w-32 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-full rounded bg-slate-100" />
    </div>
  );
}
