import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/services/apiClient";
import MangaDetails from "@/components/manga-details";
import MangaSummary from "@/components/manga-summary";
import MangaEpisodesList from "@/components/manga-episode-list";
import { LottieLoad } from "@/components/custom/loading";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { Search } from "@/components/search";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ThemeSwitch from "@/components/theme-switch";
import { TopNav } from "@/components/top-nav";

import { UserNav } from "@/components/user-nav";
import { topNav } from "@/lib/topNav";

const Manga: React.FC = () => {
  const { name } = useParams() as any;
  const [mangaDetails, setMangaDetails] = useState<any>();
  const [episodes, setEpisodes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [providerStatus, setProviderStatus] = useState({});
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const fetchMangaDetails = async (name: string) => {
    setLoadingDetails(true);
    try {
      const { data } = await apiClient().get(`/v1/ananquim/manga/${name}`);

      setMangaDetails(data);
      setEpisodes(data?.episodes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchMangaDetails(name);
  }, [name]);

  const fetchEpisodes = async (name: string) => {
    setIsModalOpen(true);
    const providers = ["ananquim", "lermangas"];

    for (let provider of providers) {
      try {
        const { data: otherProviderData } = await apiClient().get(
          `/v1/${provider}/manga/get-episodes-by-title/${name}`
        );
        if (
          otherProviderData.episodes &&
          otherProviderData.episodes.length > 0
        ) {
          setEpisodes(otherProviderData.episodes);
          setProviderStatus((prevStatus) => ({
            ...prevStatus,
            [provider]: "success",
          }));
          setIsModalOpen(false);
          break;
        } else {
          setProviderStatus((prevStatus) => ({
            ...prevStatus,
            [provider]: "fail",
          }));
        }
      } catch (error) {
        setProviderStatus((prevStatus) => ({
          ...prevStatus,
          [provider]: "error",
        }));
      }
    }
  };

  useEffect(() => {
    if (
      mangaDetails &&
      mangaDetails.episodes &&
      mangaDetails.episodes.length === 0
    ) {
      fetchEpisodes(name);
    }
  }, [mangaDetails]);

  if (loadingDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LottieLoad />
      </div>
    );
  }

  if (!mangaDetails) {
    return <div>Os detalhes do mangá não estão disponíveis no momento.</div>;
  }

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
        {episodes.length > 0 ? (
          <MangaEpisodesList
            episodes={episodes}
            title={mangaDetails.title}
            image={mangaDetails.image}
          />
        ) : (
          <div className="flex justify-center my-10">
            Não há episódios para mostrar.
          </div>
        )}
      </LayoutBody>

      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Oh, perai! Estamos buscando em nossos providers os capítulos..
            </DialogTitle>
            <DialogDescription>
              {Object.entries(providerStatus).map(([provider, status]) => (
                <p key={provider}>
                  {provider}:{" "}
                  {status === "success"
                    ? "✅"
                    : status === "fail"
                    ? "❌"
                    : "⏳"}
                </p>
              ))}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Manga;
