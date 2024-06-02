import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { apiClient } from "@/services/apiClient";

import MangaDetails from "@/components/manga-details";
import MangaSummary from "@/components/manga-summary";
import MangaEpisodesList from "@/components/manga-episode-list";
import { LottieLoad } from "@/components/custom/loading";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { Search } from "@/components/search";

import ThemeSwitch from "@/components/theme-switch";
import { TopNav } from "@/components/top-nav";
import { UserNav } from "@/components/user-nav";

const fetchMangaDetails = async (name: string) => {
  const { data } = await apiClient().get(`/api/ananquim/manga/${name}`);
  return data;
};

const Manga: React.FC = () => {
  const { name } = useParams() as any;
  const { data: mangaDetails, isLoading } = useQuery({
    queryKey: [name],
    queryFn: () => fetchMangaDetails(name),
  });

  return (
    <>
      {isLoading ? (
        <LottieLoad />
      ) : (
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
            {mangaDetails ? (
              <MangaDetails {...mangaDetails} />
            ) : (
              <div>Não há detalhes do mangá para mostrar.</div>
            )}
            {mangaDetails?.summary ? (
              <MangaSummary summary={mangaDetails.summary} />
            ) : (
              <div>Não há resumo para mostrar.</div>
            )}
            {mangaDetails?.episodes?.length > 0 ? (
              <MangaEpisodesList
                episodes={mangaDetails.episodes}
                title={mangaDetails.title}
                image={mangaDetails.image}
              />
            ) : (
              <div className="flex justify-center my-10">
                Não há episódios para mostrar.
              </div>
            )}
          </LayoutBody>
        </Layout>
      )}
    </>
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

export default Manga;
