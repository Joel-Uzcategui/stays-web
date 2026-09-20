import Link from 'next/link';
import { Pencil, Plus, Power, Search } from 'lucide-react';

import { getAdminHotels, setHotelActive } from '@/actions';
import { PageHeader, Pagination, Tag } from '@/components';

interface Props {
  searchParams: Promise<{ page?: string; q?: string; active?: string }>;
}

export default async function AdminHotelsPage({ searchParams }: Props) {
  const { page: rawPage, q, active: rawActive } = await searchParams;

  const page = Number(rawPage) > 0 ? Number(rawPage) : 1;
  const active = rawActive !== 'false';

  const [current, opposite] = await Promise.all([
    getAdminHotels({ page, q, active }),
    getAdminHotels({ limit: 1, q, active: !active }),
  ]);

  const { data: hotels, meta } = current;

  const tabs = [
    { label: 'Published', value: 'true', count: active ? meta.total : opposite.meta.total },
    { label: 'Deactivated', value: 'false', count: active ? opposite.meta.total : meta.total },
  ];

  const iconButton =
    'grid size-7 place-items-center rounded border border-line text-muted transition-colors hover:border-accent hover:text-accent';

  return (
    <>
      <PageHeader kicker="Catalog" title="Hotels">
        <Link
          href="/admin/hotels/new"
          className="flex items-center gap-1.5 rounded bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
        >
          <Plus size={15} strokeWidth={1.5} />
          New hotel
        </Link>
      </PageHeader>

      <section className="flex flex-col gap-4 px-7 pt-5 pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <form className="relative flex items-center">
            <input type="hidden" name="active" value={String(active)} />
            <Search
              size={15}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-2.5 text-faint"
            />
            <input
              name="q"
              defaultValue={q ?? ''}
              placeholder="Search name, city or country"
              className="w-68 rounded border border-line bg-white/50 py-1.5 pr-3 pl-8 text-sm placeholder:text-faint"
            />
          </form>

          <div className="flex rounded border border-line p-0.5">
            {tabs.map((tab) => {
              const selected = String(active) === tab.value;

              return (
                <Link
                  key={tab.value}
                  href={{
                    pathname: '/admin/hotels',
                    query: { active: tab.value, ...(q ? { q } : {}) },
                  }}
                  className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition-colors ${
                    selected
                      ? 'bg-accent-tint text-accent-ink'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {tab.label}
                  <span className="tabular-nums opacity-60">{tab.count}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded border border-line">
          {hotels.length === 0 ? (
            <div className="px-5 py-11 text-center">
              <p className="font-heading text-xl">No hotels match this view</p>
              <p className="mt-1.5 text-sm text-muted">
                Clear the search or pick another status.
              </p>
              <Link
                href="/admin/hotels"
                className="mt-4 inline-block rounded border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                Reset filters
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="kicker px-4 py-2.5 font-normal text-muted">
                      Hotel
                    </th>
                    <th className="kicker px-4 py-2.5 font-normal text-muted">
                      Location
                    </th>
                    <th className="kicker px-4 py-2.5 font-normal text-muted">
                      Status
                    </th>
                    <th className="kicker px-4 py-2.5 text-right font-normal text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((hotel) => (
                    <tr
                      key={hotel.id}
                      className="border-b border-line/60 last:border-0 hover:bg-surface/50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-heading text-base leading-tight">
                          {hotel.name}
                        </p>
                        {hotel.description && (
                          <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-faint">
                            {hotel.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p>{hotel.city}</p>
                        <p className="text-xs text-faint">{hotel.country}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Tag tone={hotel.active ? 'accent' : 'neutral'}>
                          {hotel.active ? 'Published' : 'Deactivated'}
                        </Tag>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/hotels/${hotel.id}`}
                            title="Edit"
                            className={iconButton}
                          >
                            <Pencil size={14} strokeWidth={1.5} />
                          </Link>
                          <form
                            action={setHotelActive.bind(
                              null,
                              hotel.id,
                              !hotel.active,
                            )}
                          >
                            <button
                              type="submit"
                              title={hotel.active ? 'Deactivate' : 'Activate'}
                              className={iconButton}
                            >
                              <Power size={14} strokeWidth={1.5} />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={meta.page}
            lastPage={meta.lastPage}
            total={meta.total}
            params={{ active: String(active), ...(q ? { q } : {}) }}
          />
        </div>
      </section>
    </>
  );
}
