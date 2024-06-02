import { Badge } from "@/components/ui/badge";
import React from "react";

interface Episode {
  title: string;
  number: number;
  releaseDate: string;
}

interface EpisodesListProps {
  episodes: Episode[];
}

const MangaEpisodesList: React.FC<EpisodesListProps> = ({ episodes }) => {
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
            key={episode.number}
            className="text-white bg-primary-foreground p-2 rounded"
          >
            <h3 className="font-bold">
              Episódio {episode.number}: {episode.title}
            </h3>
            <p>Data de lançamento: {episode.releaseDate}</p>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MangaEpisodesList;
