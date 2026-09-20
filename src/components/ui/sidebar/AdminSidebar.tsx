'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hotel, LayoutDashboard, type LucideIcon } from 'lucide-react';

interface Item {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface Group {
  title: string;
  items: Item[];
}

const groups: Group[] = [
  {
    title: 'Operations',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    title: 'Catalog',
    items: [{ label: 'Hotels', href: '/admin/hotels', icon: Hotel }],
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-0.5">
          <p className="kicker px-2 pb-2 text-faint">{group.title}</p>

          {group.items.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2.5 rounded px-2 py-2 text-sm transition-colors ${
                isActive(href)
                  ? 'bg-accent-tint text-accent-ink'
                  : 'text-muted hover:bg-surface hover:text-ink'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} className="flex-none" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
};
