import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface Episode {
  title: string;
  link: string;
  releaseDate: string;
}

interface EpisodesListProps {
  episodes: Episode[];
}

const MangaEpisodesList: React.FC<EpisodesListProps> = ({ episodes }) => {
  const { pathname } = useLocation();
  const serealizedNameAnime = pathname.split("/")[2];

  return (
    <div className="p-4 max-w-3xl mx-auto bg-zinc-900 shadow-md rounded-lg mt-4">
      <h2 className="text-2xl font-bold text-white">
        Episódios <Badge>{episodes.length}</Badge>
      </h2>
      <div className="flex items-center justify-center space-x-4 my-6">
        <button className="bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded">
          Assistir primeiro episódio
        </button>
        <button className="bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded">
          Assistir último episódio
        </button>
      </div>
      <ul className="mt-2 space-y-2">
        {episodes.map((episode) => (
          <li
            key={episode.link}
            className="text-white bg-primary-foreground p-2 rounded"
          >
            <Link
              to={`/ler-manga/${serealizedNameAnime}/${
                episode.link.split("/")[episode.link.split("/").length - 2]
              }`}
            >
              <h3 className="font-bold">Episódio: {episode.title}</h3>
            </Link>
            <p>Data de lançamento: {episode.releaseDate}</p>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MangaEpisodesList;
