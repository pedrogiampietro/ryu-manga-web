import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface Episode {
  title: string;
  link: string;
  releaseDate: string;
}

interface EpisodesListProps {
  episodes: Episode[];
  title: string;
  image: string;
}

const MangaEpisodesList: React.FC<EpisodesListProps> = ({
  episodes,
  title,
  image,
}) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const serealizedNameAnime = pathname?.split("/")[2];

  const stateObj = {
    episodes,
    title,
    image,
  };

  const saveLastRead = async (manga: any) => {
    if (user) {
      try {
        const response = await apiClient().post("/v1/lastWatched", {
          userId: user?.userId,
          mangaId: manga.identifier,
          cover: image,
          title: title,
          episodio: manga.episodio,
        });

        if (response.status === 201) {
          console.log("Manga adicionado aos últimos lidos com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao adicionar manga aos últimos lidos", error);
      }
    } else {
      let lastRead = JSON.parse(localStorage.getItem("lastRead") as any) || [];
      const index = lastRead.findIndex(
        (item: any) => item.identifier === manga.identifier
      );

      if (index !== -1) {
        // Se o mangá já estiver na lista, atualize o episódio
        lastRead[index] = manga;
      } else {
        // Se o mangá não estiver na lista, adicione-o
        lastRead.push(manga);
      }

      localStorage.setItem("lastRead", JSON.stringify(lastRead));
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-zinc-900 shadow-md rounded-lg mt-4">
      <h2 className="text-2xl font-bold text-white">
        Episódios <Badge>{episodes.length}</Badge>
      </h2>
      <div className="flex items-center justify-center space-x-4 my-6">
        <button
          className="bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            navigate(
              `/ler-manga/${serealizedNameAnime}/${
                episodes[episodes.length - 1].link?.split("/")[
                  episodes[episodes.length - 1].link?.split("/").length - 2
                ]
              }`,
              { state: stateObj }
            );
          }}
        >
          Assistir primeiro episódio
        </button>
        <button
          className="bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            navigate(
              `/ler-manga/${serealizedNameAnime}/${
                episodes[0].link?.split("/")[
                  episodes[0].link?.split("/").length - 2
                ]
              }`,
              { state: stateObj }
            );
          }}
        >
          {" "}
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
              to={{
                pathname: `/ler-manga/${serealizedNameAnime}/${
                  episode.link?.split("/")[episode.link?.split("/").length - 2]
                }`,
              }}
              state={stateObj}
              onClick={() =>
                saveLastRead({
                  identifier: serealizedNameAnime,
                  episodio:
                    episode.link?.split("/")[
                      episode.link?.split("/").length - 2
                    ],
                  title: title,
                  image: image,
                })
              }
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
