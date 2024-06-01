import { useState, useEffect } from "react";

import { Search } from "@/components/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeSwitch from "@/components/theme-switch";
import { TopNav } from "@/components/top-nav";
import { UserNav } from "@/components/user-nav";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { CardManga } from "@/components/manga-card";
import { apiClient } from "@/services/apiClient";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [latestAnimes, setLatestAnimes] = useState([]);

  const getLatestAnimes = async () => {
    setLoading(true);

    try {
      const { data } = await apiClient().get("/api/ananquim/latest");

      setLatestAnimes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLatestAnimes();
  }, []);

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
        <div className="flex items-center gap-3 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ryu Mangás
          </h1>
          <p>Since 2024 - Sem popups! Totalmente Gratuito!</p>
        </div>
        <Tabs orientation="vertical" defaultValue="home" className="space-y-4">
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="home">Geral</TabsTrigger>
              <TabsTrigger value="latest">Últimos ançamentos</TabsTrigger>
              <TabsTrigger value="trendings">+ Assistidos</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="home" className="space-y-4">
            {loading ? (
              <span>Carregando... </span>
            ) : latestAnimes && latestAnimes.length > 0 ? (
              <CardManga manga={latestAnimes} />
            ) : (
              <span>Nenhum anime encontrado</span>
            )}
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}

const topNav = [
  {
    title: "Home",
    href: "dashboard/home",
    isActive: true,
  },
  {
    title: "Register",
    href: "auth/register",
    isActive: false,
  },
];
