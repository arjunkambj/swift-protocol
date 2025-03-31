type StatItemProps = {
  value: string;
  label: string;
};

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center stat-item">
      <p className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
        {value}
      </p>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatItem value="$5M+" label="Total Value Staked" />
          <StatItem value="< a sec" label="Transaction Speed" />
          <StatItem value="0.3%" label="Protocol Fee" />
          <StatItem value="32+" label="Tokens Supported" />
        </div>
      </div>
    </div>
  );
}
