import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";
import { IconEye, IconEyeCancel } from "@tabler/icons-react";

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
  const [isOpen, setIsOpen] = React.useState(false);

  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const serializedNameAnime = pathname?.split("/")[2];

  const stateObj = {
    episodes,
    title,
    image,
  };

  const saveLastRead = async (manga: any) => {
    const match = manga.episodio.match(/(\d+(\.\d+)?)/);
    const numeroCapitulo = match ? match[1] : "N/A";

    if (user) {
      try {
        const response = await apiClient().post("/v1/lastWatched", {
          userId: user?.userId,
          mangaId: manga.identifier,
          cover: manga.image,
          title: manga.title,
          episodio: manga.episodio,
          currentEpisode: numeroCapitulo,
          totalEpisodes: episodes.length,
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
        lastRead[index] = manga;
      } else {
        lastRead.push(manga);
      }

      localStorage.setItem("lastRead", JSON.stringify(lastRead));
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-zinc-900 shadow-md rounded-lg mt-4">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={image}
          alt={title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <h2 className="text-3xl font-bold text-white">
          {title} <Badge>{episodes.length}</Badge>
        </h2>
      </div>
      <div className="flex items-center justify-center space-x-4 my-6">
        <button
          className="bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            navigate(
              `/ler-manga/${serializedNameAnime}/${
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
              `/ler-manga/${serializedNameAnime}/${
                episodes[0].link?.split("/")[
                  episodes[0].link?.split("/").length - 2
                ]
              }`,
              { state: stateObj }
            );
          }}
        >
          Assistir último episódio
        </button>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm text-primary font-bold">
            Expanda aqui para ver todos os episodios
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <IconEyeCancel className="h-4 w-4" />
              ) : (
                <IconEye className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {episodes.map((episode) => (
              <div
                key={episode.link}
                className="text-white bg-primary-foreground p-4 rounded-lg hover:bg-primary transition-colors"
              >
                <Link
                  to={{
                    pathname: `/ler-manga/${serializedNameAnime}/${
                      episode.link?.split("/")[
                        episode.link?.split("/").length - 2
                      ]
                    }`,
                  }}
                  state={stateObj}
                  onClick={() =>
                    saveLastRead({
                      identifier: serializedNameAnime,
                      episodio:
                        episode.link?.split("/")[
                          episode.link?.split("/").length - 2
                        ],
                      title: title,
                      image: image,
                    })
                  }
                  className="block"
                >
                  <h3 className="font-bold text-lg">
                    Episódio: {episode.title}
                  </h3>
                  <p className="text-sm">
                    Data de lançamento: {episode.releaseDate}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MangaEpisodesList;
