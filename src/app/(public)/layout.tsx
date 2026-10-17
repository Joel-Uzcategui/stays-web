import { Footer, TopMenu } from "@/components";
import { getCurrentUser } from "@/lib/session-store";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <TopMenu user={user} />
      {children}
      <Footer />
    </div>
  );
}
