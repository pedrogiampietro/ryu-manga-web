import React, { useState, useEffect } from "react";

import { apiClient } from "@/services/apiClient";
import { useParams } from "react-router-dom";

import MangaDetails from "@/components/manga-details";
import MangaSummary from "@/components/manga-summary";
import MangaEpisodesList from "@/components/manga-episode-list";
import { LottieLoad } from "@/components/custom/loading";

const Manga: React.FC = () => {
  const [mangaDetails, setMangaDetails] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { name } = useParams();

  const getMangaDetails = async () => {
    setLoading(true);

    try {
      const { data } = await apiClient().get(`/api/ananquim/manga/${name}`);
      setMangaDetails(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMangaDetails();
  }, []);

  return (
    <>
      {loading ? (
        <LottieLoad />
      ) : mangaDetails && mangaDetails?.episodes?.length > 0 ? (
        <>
          <MangaDetails {...mangaDetails} />
          <MangaSummary summary={mangaDetails.summary} />
          <MangaEpisodesList episodes={mangaDetails.episodes} />
        </>
      ) : null}
    </>
  );
};

export default Manga;
