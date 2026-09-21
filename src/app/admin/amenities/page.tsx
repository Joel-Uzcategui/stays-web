import Link from 'next/link';
import { Pencil, Plus, Power, Search } from 'lucide-react';

import { getAdminAmenities, setAmenityActive } from '@/actions';
import { PageHeader, Pagination, Tag } from '@/components';
import { AMENITY_SCOPES, type AmenityScope } from '@/interfaces';

interface Props {
  searchParams: Promise<{
    q?: string;
    scope?: string;
    page?: string;
    active?: string;
  }>;
}

const isScope = (value?: string): value is AmenityScope =>
  AMENITY_SCOPES.includes(value as AmenityScope);

export default async function AdminAmenitiesPage({ searchParams }: Props) {
  const {
    q,
    scope: rawScope,
    page: rawPage,
    active: rawActive,
  } = await searchParams;

  const page = Number(rawPage) > 0 ? Number(rawPage) : 1;
  const active = rawActive !== 'false';
  const scope = isScope(rawScope) ? rawScope : undefined;

  const list = await getAdminAmenities({ q, scope, page, active });

  const filters = {
    ...(q ? { q } : {}),
    ...(scope ? { scope } : {}),
  };

  const iconButton =
    'grid size-7 place-items-center rounded border border-line text-muted transition-colors hover:border-accent hover:text-accent';

  return (
    <>
      <PageHeader kicker="Catalog" title="Amenities">
        <Link
          href="/admin/amenities/new"
          className="flex items-center gap-1.5 rounded bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
        >
          <Plus size={15} strokeWidth={1.5} />
          New amenity
        </Link>
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
                placeholder="Search by name or code"
                className="w-64 rounded border border-line bg-white/50 py-1.5 pr-3 pl-8 text-sm placeholder:text-faint"
              />
            </div>

            <select
              name="scope"
              defaultValue={scope ?? ''}
              className="rounded border border-line bg-white/50 px-3 py-1.5 text-sm"
            >
              <option value="">All scopes</option>
              {AMENITY_SCOPES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded border border-line px-2.5 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent"
            >
              Search
            </button>

            {(q || scope) && (
              <Link
                href="/admin/amenities"
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
                  pathname: '/admin/amenities',
                  query: { active: tab.value, ...filters },
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
              <p className="font-heading text-xl">No amenities here yet</p>
              <p className="mt-1.5 text-sm text-muted">
                {q ? `Nothing matches "${q}".` : 'Nothing matches this filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="kicker px-4 py-2.5 font-normal text-muted">
                      Amenity
                    </th>
                    <th className="kicker px-4 py-2.5 font-normal text-muted">
                      Code
                    </th>
                    <th className="kicker px-4 py-2.5 font-normal text-muted">
                      Scope
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
                  {list.data.map((amenity) => (
                    <tr
                      key={amenity.id}
                      className="border-b border-line/60 last:border-0 hover:bg-surface/50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-heading text-base leading-tight">
                          {amenity.name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-surface px-1.5 py-0.5 text-xs text-muted">
                          {amenity.code}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-muted">{amenity.scope}</td>
                      <td className="px-4 py-3">
                        <Tag tone={amenity.active ? 'accent' : 'neutral'}>
                          {amenity.active ? 'Published' : 'Deactivated'}
                        </Tag>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/amenities/${amenity.id}`}
                            title="Edit"
                            className={iconButton}
                          >
                            <Pencil size={14} strokeWidth={1.5} />
                          </Link>
                          <form
                            action={setAmenityActive.bind(
                              null,
                              amenity.id,
                              !amenity.active,
                            )}
                          >
                            <button
                              type="submit"
                              title={
                                amenity.active ? 'Deactivate' : 'Activate'
                              }
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
            page={list.meta.page}
            lastPage={list.meta.lastPage}
            total={list.meta.total}
            noun={['amenity', 'amenities']}
            params={{ active: String(active), ...filters }}
          />
        </div>
      </section>
    </>
  );
}
