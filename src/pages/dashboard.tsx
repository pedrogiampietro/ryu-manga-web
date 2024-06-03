import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Search } from "@/components/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeSwitch from "@/components/theme-switch";
import { TopNav } from "@/components/top-nav";
import { UserNav } from "@/components/user-nav";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { CardManga } from "@/components/manga-card";
import { apiClient } from "@/services/apiClient";
import { LastReadCard } from "@/components/last-read-card";
import axios from "axios";

const Dashboard: React.FC = () => {
  const lastRead = JSON.parse(localStorage.getItem("lastRead") as any) || [];

  const fetchAnimes = async (type: string) => {
    const { data } = await apiClient().get(`/api/ananquim/${type}`);
    return data;
  };

  const { data: geralAnimes, isLoading: loadingGeral } = useQuery({
    queryKey: ["geral"],
    queryFn: () => fetchAnimes(""),
  });
  const { data: latestAnimes, isLoading: loadingLatest } = useQuery({
    queryKey: ["latest"],
    queryFn: () => fetchAnimes("latest"),
  });
  const { data: trendingAnimes, isLoading: loadingTrending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchAnimes("trending"),
  });

  const isLoading = loadingGeral || loadingLatest || loadingTrending;

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
              <TabsTrigger value="latest">Últimos Lançamentos</TabsTrigger>
              <TabsTrigger value="trendings">+ Lidos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="home" className="space-y-4">
            {isLoading ? (
              <span>Carregando... </span>
            ) : geralAnimes && geralAnimes.length > 0 ? (
              <CardManga manga={geralAnimes} />
            ) : (
              <span>Nenhum anime encontrado</span>
            )}
          </TabsContent>

          <TabsContent value="latest" className="space-y-4">
            {isLoading ? (
              <span>Carregando... </span>
            ) : latestAnimes && latestAnimes.length > 0 ? (
              <CardManga manga={latestAnimes} />
            ) : (
              <span>Nenhum anime encontrado</span>
            )}
          </TabsContent>

          <TabsContent value="trendings" className="space-y-4">
            {isLoading ? (
              <span>Carregando... </span>
            ) : trendingAnimes && trendingAnimes.length > 0 ? (
              <CardManga manga={trendingAnimes} />
            ) : (
              <span>Nenhum anime encontrado</span>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center  gap-3 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Lidos por último
          </h1>
        </div>
        <LastReadCard manga={lastRead} />
      </LayoutBody>
    </Layout>
  );
};

const topNav = [
  {
    title: "Home",
    href: "/",
    isActive: true,
  },
  {
    title: "Register",
    href: "auth/register",
    isActive: false,
  },
];

export default Dashboard;
