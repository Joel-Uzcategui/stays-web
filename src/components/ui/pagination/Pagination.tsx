import Link from 'next/link';

interface Props {
  page: number;
  lastPage: number;
  total: number;
  params?: Record<string, string>;
}

const base =
  'rounded border border-line px-2.5 py-1 text-xs transition-colors';

export const Pagination = ({ page, lastPage, total, params = {} }: Props) => {
  const href = (target: number) =>
    `?${new URLSearchParams({ ...params, page: String(target) })}`;

  const step = (label: string, target: number, enabled: boolean) =>
    enabled ? (
      <Link href={href(target)} className={`${base} hover:border-accent hover:text-accent`}>
        {label}
      </Link>
    ) : (
      <span className={`${base} text-faint`}>{label}</span>
    );

  return (
    <div className="flex items-center gap-3 border-t border-line px-4 py-3">
      <p className="text-xs text-muted">
        {total} {total === 1 ? 'hotel' : 'hotels'}
        {lastPage > 1 && ` · page ${page} of ${lastPage}`}
      </p>

      {lastPage > 1 && (
        <div className="ml-auto flex items-center gap-1.5">
          {step('Prev', page - 1, page > 1)}
          {step('Next', page + 1, page < lastPage)}
        </div>
      )}
    </div>
  );
};
