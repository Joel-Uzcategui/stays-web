import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SPAN = 1;

interface Props {
  page: number;
  lastPage: number;
  total: number;
  noun?: [string, string];
  params?: Record<string, string>;
}

const slots = (page: number, lastPage: number) => {
  const wanted = new Set([1, lastPage]);

  for (let target = page - SPAN; target <= page + SPAN; target++) {
    if (target >= 1 && target <= lastPage) {
      wanted.add(target);
    }
  }

  const sorted = [...wanted].sort((a, b) => a - b);

  return sorted.flatMap((value, index) =>
    index > 0 && value - sorted[index - 1] > 1
      ? (['gap', value] as const)
      : ([value] as const),
  );
};

const cell =
  'grid h-7 min-w-7 place-items-center rounded border px-1.5 text-xs transition-colors';

export const Pagination = ({
  page,
  lastPage,
  total,
  noun = ['hotel', 'hotels'],
  params = {},
}: Props) => {
  const href = (target: number) =>
    `?${new URLSearchParams({ ...params, page: String(target) })}`;

  const arrow = (label: string, target: number, enabled: boolean) => {
    const Icon = label === 'Previous' ? ChevronLeft : ChevronRight;

    return enabled ? (
      <Link
        href={href(target)}
        aria-label={label}
        className={`${cell} border-line hover:border-accent hover:text-accent`}
      >
        <Icon size={13} strokeWidth={2} />
      </Link>
    ) : (
      <span aria-hidden className={`${cell} border-line text-faint opacity-50`}>
        <Icon size={13} strokeWidth={2} />
      </span>
    );
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3"
    >
      <p className="text-xs text-muted">
        {total} {total === 1 ? noun[0] : noun[1]}
      </p>

      {lastPage > 1 && (
        <div className="ml-auto flex items-center gap-1">
          {arrow('Previous', page - 1, page > 1)}

          {slots(page, lastPage).map((slot, index) =>
            slot === 'gap' ? (
              <span
                key={`gap-${index}`}
                aria-hidden
                className="px-0.5 text-xs text-faint"
              >
                …
              </span>
            ) : slot === page ? (
              <span
                key={slot}
                aria-current="page"
                className={`${cell} border-accent bg-accent font-medium text-white`}
              >
                {slot}
              </span>
            ) : (
              <Link
                key={slot}
                href={href(slot)}
                className={`${cell} border-line hover:border-accent hover:text-accent`}
              >
                {slot}
              </Link>
            ),
          )}

          {arrow('Next', page + 1, page < lastPage)}
        </div>
      )}
    </nav>
  );
};
