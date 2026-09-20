import { TopMenu } from '@/components';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopMenu />
      {children}
    </div>
  );
}
