import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getAdminHotels } from '@/actions';
import { PageHeader, StatCard, Tag } from '@/components';

export default async function AdminPage() {
  const [active, inactive, recent] = await Promise.all([
    getAdminHotels({ limit: 1, active: true }),
    getAdminHotels({ limit: 1, active: false }),
    getAdminHotels({ limit: 5, active: true }),
  ]);

  const total = active.meta.total + inactive.meta.total;

  return (
    <>
      <PageHeader kicker="Operations" title="Dashboard" />

      <section className="flex flex-col gap-6 px-7 pt-6 pb-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Published"
            value={active.meta.total}
            note="Visible to guests"
          />
          <StatCard
            label="Deactivated"
            value={inactive.meta.total}
            note="Hidden, recoverable"
          />
          <StatCard label="Total" value={total} note="In the catalog" />
        </div>

        <div className="rounded border border-line">
          <div className="flex items-baseline gap-3 border-b border-line px-4 py-3">
            <h2 className="text-base">Recently added</h2>
            <Link
              href="/admin/hotels"
              className="ml-auto flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
            >
              All hotels
              <ArrowRight size={13} strokeWidth={1.5} />
            </Link>
          </div>

          {recent.data.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              No hotels in the catalog yet.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <tbody>
                {recent.data.map((hotel) => (
                  <tr
                    key={hotel.id}
                    className="border-b border-line/60 last:border-0"
                  >
                    <td className="px-4 py-2.5 font-heading text-base">
                      {hotel.name}
                    </td>
                    <td className="px-4 py-2.5 text-muted">
                      {hotel.city}, {hotel.country}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Tag tone="accent">Published</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
