import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeSwitch from "@/components/theme-switch";
import { UserNav } from "@/components/user-nav";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { CardManga } from "@/components/manga-card";
import { apiClient } from "@/services/apiClient";
import { LastReadCard } from "@/components/last-read-card";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/top-nav";
import { topNav } from "@/lib/topNav";
import { LottieLoad } from "@/components/custom/loading";
import { Sidebar } from "@/components/sidebar";
import useIsCollapsed from "@/hooks/useIsCollapsed";
import Combobox from "@/components/ui/combobox";

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const lastRead = JSON.parse(localStorage.getItem("lastRead") as any) || [];
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const [favorites, setFavorites] = useState([]);
  const [lastWatched, setLastWatched] = useState([]);
  const [loadingLastWatched, setLoadingLastWatched] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoadingFavorites(true);
    const { data } = await apiClient().get(`/v1/favorites`, {
      params: { userId: user?.userId },
    });

    setFavorites(data);
    setLoadingFavorites(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchLastRead = async () => {
      if (!isAuthenticated) {
        return [];
      }

      setLoadingLastWatched(true);
      const { data } = await apiClient().get(`/v1/lastWatched`, {
        params: { userId: user?.userId },
      });
      setLastWatched(data);
      setLoadingLastWatched(false);
    };

    fetchLastRead();
  }, [isAuthenticated, user]);

  const fetchMangas = async (type: string) => {
    const { data } = await apiClient().get(`/v1/ananquim/${type}`);
    return data;
  };

  const { data: geralMangas, isLoading: loadingGeral } = useQuery({
    queryKey: ["geral"],
    queryFn: () => fetchMangas(""),
  });
  const { data: latestMangas, isLoading: loadingLatest } = useQuery({
    queryKey: ["latest"],
    queryFn: () => fetchMangas("latest"),
  });
  const { data: trendingMangas, isLoading: loadingTrending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchMangas("trending"),
  });

  const isLoading = loadingGeral || loadingLatest || loadingTrending;

  if (isLoading) {
    return <LottieLoad />;
  }

  if (!geralMangas || !latestMangas || !trendingMangas) {
    return <div>Não foi possível carregar os mangás.</div>;
  }

  return (
    <Layout>
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className="ml-auto hidden md:flex items-center space-x-4">
          <Combobox />
          <ThemeSwitch />
          {isAuthenticated ? (
            <UserNav />
          ) : (
            <Button onClick={() => navigate("/auth/login")}>Login</Button>
          )}
        </div>
      </LayoutHeader>

      <div className="md:hidden flex mt-6 px-4">
        <Combobox />
      </div>

      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        loadingFavorites={loadingFavorites}
        favorites={favorites}
        favoritesCallback={fetchFavorites}
      />

      <LayoutBody className="space-y-4 md:ml-64 sm:ml-0">
        <div className="flex items-center gap-3 space-y-2 relative mb-4 font-semibold xl:text-lg">
          <div className="mr-2 h-14 w-1 rounded-md bg-primary md:w-2"></div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ryu Mangás
          </h1>

          <p>Criado por vocês, para vocês 🔥</p>
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
            ) : geralMangas && geralMangas.length > 0 ? (
              <CardManga
                manga={geralMangas}
                favoritesCallback={fetchFavorites}
              />
            ) : (
              <span>Nenhum manga encontrado</span>
            )}
          </TabsContent>

          <TabsContent value="latest" className="space-y-4">
            {isLoading ? (
              <span>Carregando... </span>
            ) : latestMangas && latestMangas.length > 0 ? (
              <CardManga
                manga={latestMangas}
                favoritesCallback={fetchFavorites}
              />
            ) : (
              <span>Nenhum manga encontrado</span>
            )}
          </TabsContent>

          <TabsContent value="trendings" className="space-y-4">
            {isLoading ? (
              <span>Carregando... </span>
            ) : trendingMangas && trendingMangas.length > 0 ? (
              <CardManga
                manga={trendingMangas}
                favoritesCallback={fetchFavorites}
              />
            ) : (
              <span>Nenhum manga encontrado</span>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-3 space-y-2 relative mb-4 font-semibold xl:text-lg">
          <div className="mr-2 h-14 w-1 rounded-md bg-primary md:w-2"></div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Lidos por último
          </h1>
        </div>
        {loadingLastWatched ? (
          <span>Carregando... </span>
        ) : lastWatched && lastWatched.length > 0 ? (
          <LastReadCard
            manga={isAuthenticated ? lastWatched : lastRead}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <span>Nenhum manga encontrado</span>
        )}
      </LayoutBody>
    </Layout>
  );
};

export default Dashboard;
