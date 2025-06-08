import { SidebarLayout as CatalystSidebarLayout } from "@/components/ui/sidebar-layout";
import { getSession } from "@/lib/session";
import { getInitials } from "@/lib/string";
import { Navbar, Sidebar } from "@/app/(app)/navigation";

export default async function SidebarLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const initials = getInitials(session?.name ?? "Unidentified");

  return (
    <CatalystSidebarLayout
      navbar={<Navbar initials={initials}></Navbar>}
      sidebar={<Sidebar initials={initials} name={session?.name}></Sidebar>}
    >
      {children}
    </CatalystSidebarLayout>
  );
}
