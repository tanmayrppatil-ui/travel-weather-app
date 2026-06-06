import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { rankActivities } from '@/lib/rankActivities';
import type { DailySummary } from '@/types/forecast';

interface ActivityListProps {
  daily: DailySummary[] | undefined;
  isLoading: boolean;
}

export function ActivityList({ daily, isLoading }: ActivityListProps) {
  if (isLoading) {
    return (
      <aside aria-label="Activity recommendations" aria-busy="true">
        <h2 className="text-lg font-semibold text-slate-800">Activities</h2>
        <ul className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  if (!daily?.length) {
    return (
      <aside aria-label="Activity recommendations">
        <div className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
        <p className="text-base font-medium text-slate-700">No activities yet</p>
        <p className="mt-2 max-w-sm text-sm text-slate-500">Forecast data is needed to rank activities.</p>
        </div>
      </aside>
    );
  }

  const ranked = rankActivities(daily);
  const maxScore = Math.max(...ranked.map((a) => a.score), 1);

  return (
    <aside aria-label="Activity recommendations">
      <h2 className="text-lg font-semibold text-slate-800">Activities</h2>
      <p className="mt-1 text-sm text-slate-500">
        Ranked for the next 3 days based on forecast conditions
      </p>
      <ol className="mt-4 space-y-3">
        {ranked.map((activity, index) => (
          <li
            key={activity.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-800">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{activity.label}</p>
                <p className="mt-1 text-sm text-slate-600">{activity.reason}</p>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${(activity.score / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
