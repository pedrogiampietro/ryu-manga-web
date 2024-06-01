// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Search } from "@/components/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeSwitch from "@/components/theme-switch";
import { TopNav } from "@/components/top-nav";
import { UserNav } from "@/components/user-nav";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";

export default function Dashboard() {
  return (
    <Layout>
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>
        </div>
        <Tabs
          orientation="vertical"
          defaultValue="overview"
          className="space-y-4"
        >
          <div className="w-full overflow-x-scroll pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-4"></TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}

const topNav = [
  {
    title: "Overview",
    href: "dashboard/overview",
    isActive: true,
  },
  {
    title: "Customers",
    href: "dashboard/customers",
    isActive: false,
  },
  {
    title: "Products",
    href: "dashboard/products",
    isActive: false,
  },
  {
    title: "Settings",
    href: "dashboard/settings",
    isActive: false,
  },
];
