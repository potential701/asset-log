"use client";

import { Navbar as CatalystNavbar, NavbarItem, NavbarSection, NavbarSpacer } from "@/components/ui/navbar";
import { HomeIcon, Squares2X2Icon } from "@heroicons/react/20/solid";
import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from "@/components/ui/dropdown";
import { Avatar } from "@/components/ui/avatar";
import { ArrowRightStartOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  Sidebar as CatalystSidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function Navbar({ initials }: { initials: string }) {
  return (
    <CatalystNavbar>
      <NavbarSpacer />
      <NavbarSection>
        <Dropdown>
          <DropdownButton as={NavbarItem}>
            <Avatar initials={initials} square />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom end">
            <DropdownItem href="/auth/logout">
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarSection>
    </CatalystNavbar>
  );
}

export function Sidebar({ initials, name }: { initials: string; name?: string }) {
  const pathname = usePathname();
  return (
    <CatalystSidebar>
      <SidebarHeader className="max-lg:hidden">
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <article className="flex min-w-0 items-center gap-3">
              <Avatar initials={initials} className="size-10" square />
              <p className="min-w-0">
                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{name}</span>
              </p>
            </article>
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="top start">
            <DropdownItem href="/auth/logout">
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/" current={pathname === "/"}>
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/asset" current={pathname.startsWith("/asset")}>
            <Squares2X2Icon />
            <SidebarLabel>Asset</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
    </CatalystSidebar>
  );
}
