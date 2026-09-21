import Link from 'next/link';
import { Pencil, Plus, Power, Search } from 'lucide-react';

import {
  getAdminHotels,
  getAdminRoomTypes,
  setRoomTypeActive,
} from '@/actions';
import { PageHeader, Pagination, Tag } from '@/components';

interface Props {
  searchParams: Promise<{
    hotelId?: string;
    q?: string;
    page?: string;
    active?: string;
  }>;
}

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(
    cents / 100,
  );

export default async function AdminRoomTypesPage({ searchParams }: Props) {
  const {
    hotelId,
    q,
    page: rawPage,
    active: rawActive,
  } = await searchParams;

  const page = Number(rawPage) > 0 ? Number(rawPage) : 1;
  const active = rawActive !== 'false';

  const [hotels, list] = await Promise.all([
    getAdminHotels({ limit: 100 }),
    getAdminRoomTypes({ hotelId, q, page, active }),
  ]);

  const query = { ...(hotelId ? { hotelId } : {}), ...(q ? { q } : {}) };

  return (
    <>
      <PageHeader kicker="Catalog" title="Room types">
        {(
          <Link
            href="/admin/room-types/new"
            className="flex items-center gap-1.5 rounded bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
          >
            <Plus size={15} strokeWidth={1.5} />
            New room type
          </Link>
        )}
      </PageHeader>

      <section className="flex flex-col gap-4 px-7 pt-5 pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <form className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="active" value={String(active)} />

            <div className="relative flex items-center">
              <Search
                size={15}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-2.5 text-faint"
              />
              <input
                name="q"
                defaultValue={q ?? ''}
                placeholder="Search by name"
                className="w-64 rounded border border-line bg-white/50 py-1.5 pr-3 pl-8 text-sm placeholder:text-faint"
              />
            </div>

            <select
              name="hotelId"
              defaultValue={hotelId ?? ''}
              className="rounded border border-line bg-white/50 px-3 py-1.5 text-sm"
            >
              <option value="">All hotels</option>
              {hotels.data.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded border border-line px-2.5 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent"
            >
              Search
            </button>

            {(q || hotelId) && (
              <Link
                href="/admin/room-types"
                className="px-1 text-xs text-muted transition-colors hover:text-accent"
              >
                Clear
              </Link>
            )}
          </form>

          <div className="ml-auto flex rounded border border-line p-0.5">
            {[
              { label: 'Published', value: 'true' },
              { label: 'Deactivated', value: 'false' },
            ].map((tab) => (
              <Link
                key={tab.value}
                href={{
                  pathname: '/admin/room-types',
                  query: { active: tab.value, ...query },
                }}
                className={`rounded px-2.5 py-1 text-xs transition-colors ${
                  String(active) === tab.value
                    ? 'bg-accent-tint text-accent-ink'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded border border-line">
          {list.data.length === 0 ? (
            <div className="px-5 py-11 text-center">
              <p className="font-heading text-xl">No room types here yet</p>
              <p className="mt-1.5 text-sm text-muted">
                {q
                  ? `Nothing matches "${q}".`
                  : 'Nothing matches this filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="kicker px-4 py-2.5 font-normal text-muted">
                      Room type
                    </th>
                    <th className="kicker px-4 py-2.5 font-normal text-muted">
                      Hotel
                    </th>
                    <th className="kicker px-4 py-2.5 text-right font-normal text-muted">
                      Capacity
                    </th>
                    <th className="kicker px-4 py-2.5 text-right font-normal text-muted">
                      Price
                    </th>
                    <th className="kicker px-4 py-2.5 text-right font-normal text-muted">
                      Units
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
                  {list.data.map((roomType) => (
                    <tr
                      key={roomType.id}
                      className="border-b border-line/60 last:border-0 hover:bg-surface/50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-heading text-base leading-tight">
                          {roomType.name}
                        </p>
                        {roomType.description && (
                          <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-faint">
                            {roomType.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {roomType.hotel?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {roomType.capacity}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {money(roomType.priceCents, roomType.currency)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {roomType.defaultUnits}
                      </td>
                      <td className="px-4 py-3">
                        <Tag tone={roomType.active ? 'accent' : 'neutral'}>
                          {roomType.active ? 'Published' : 'Deactivated'}
                        </Tag>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/room-types/${roomType.id}?hotelId=${roomType.hotelId}`}
                            title="Edit"
                            className="grid size-7 place-items-center rounded border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                          >
                            <Pencil size={14} strokeWidth={1.5} />
                          </Link>
                          <form
                            action={setRoomTypeActive.bind(
                              null,
                              roomType.hotelId,
                              roomType.id,
                              !roomType.active,
                            )}
                          >
                            <button
                              type="submit"
                              title={roomType.active ? 'Deactivate' : 'Activate'}
                              className="grid size-7 place-items-center rounded border border-line text-muted transition-colors hover:border-accent hover:text-accent"
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
            page={list.meta.page}
            lastPage={list.meta.lastPage}
            total={list.meta.total}
            noun={['room type', 'room types']}
            params={{ active: String(active), ...query }}
          />
        </div>
      </section>
    </>
  );
}
