import { Outlet } from "react-router-dom";
import { IconPalette, IconTool, IconUser } from "@tabler/icons-react";
import { Search } from "@/components/search";
import { Separator } from "@/components/ui/separator";
import ThemeSwitch from "@/components/theme-switch";
import { UserNav } from "@/components/user-nav";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import SidebarNav from "./components/sidebar-nav";
import { TopNav } from "@/components/top-nav";
import { topNav } from "@/lib/topNav";

export default function Settings() {
  return (
    <Layout fadedBelow fixedHeight>
      <LayoutHeader>
        <TopNav links={topNav} />
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta e defina preferências de
            e-mail.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="sticky top-0 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="w-full p-1 pr-4 lg:max-w-xl">
            <div className="pb-16">
              <Outlet />
            </div>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  );
}

const sidebarNavItems = [
  {
    title: "Profile",
    icon: <IconUser size={18} />,
    href: "/settings",
  },
  {
    title: "Account",
    icon: <IconTool size={18} />,
    href: "/settings/account",
  },
  {
    title: "Appearance",
    icon: <IconPalette size={18} />,
    href: "/settings/appearance",
  },
  // {
  //   title: "Notifications",
  //   icon: <IconNotification size={18} />,
  //   href: "/settings/notifications",
  // },
  // {
  //   title: "Display",
  //   icon: <IconBrowserCheck size={18} />,
  //   href: "/settings/display",
  // },
];
