import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { LottieLoad } from "@/components/custom/loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HomeIcon, MenuIcon } from "lucide-react";

const MangaReader = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("page");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname, state } = useLocation();
  const parts = pathname.split("/");
  const initialChapter = {
    identifier: parts[2],
    episodio: parts[3],
    title: "",
    image: "",
  };
  const [chapter, setChapter] = useState(initialChapter);
  const navigate = useNavigate();

  const fetchMangaDetails = async ({ queryKey }: any) => {
    const [_, identifier, episodio] = queryKey;
    const { data } = await apiClient().get(
      `/v1/ananquim/manga/${identifier}/${episodio}/read`
    );

    setCurrentPage(0);
    return data;
  };

  const { data: readingData, isLoading: loading } = useQuery({
    queryKey: ["mangaDetails", chapter.identifier, chapter.episodio],
    queryFn: fetchMangaDetails,
    enabled: !!chapter.identifier && !!chapter.episodio,
  });

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const saveLastRead = (manga: any) => {
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
  };

  const EpisodesPanel = () => (
    <div
      className={`fixed top-0 left-0 h-full w-48 bg-gray-900 text-white overflow-y-auto shadow-lg transform transition-transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:block z-40`}
    >
      <h2 className="text-xl font-bold p-4 border-b border-gray-700 mt-12 md:mt-0">
        Episódios
      </h2>
      <ul>
        {state.episodes.map((episode: any) => {
          const parts = episode.link.split("/");
          const name = parts[4];
          const episodio = parts[5];
          const isActive = chapter.episodio === episodio;

          return (
            <li key={episode.id} className="p-2">
              <Badge
                onClick={() => {
                  const newChapter = {
                    identifier: name,
                    episodio: episodio,
                    title: state.title,
                    image: state.image,
                  };
                  setChapter(newChapter);
                  saveLastRead(newChapter);
                  setIsMenuOpen(false); // Close menu after selecting an episode
                }}
                className={`cursor-pointer ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {episodio}
              </Badge>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <button
        className="fixed top-4 left-4 z-50 block md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <MenuIcon className="w-8 h-8 text-white" />
      </button>
      <EpisodesPanel />
      <div className="flex flex-col items-center justify-center flex-grow ml-0 md:ml-48">
        <header className="fixed top-0 left-0 md:left-48 right-0 bg-gray-900 p-4 z-30 shadow-md border-b border-gray-700">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary-foreground text-white px-4 py-2 rounded"
            >
              <HomeIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl md:text-4xl font-bold text-white text-center">
              Ryu Mangá - Lendo atualmente: {chapter.identifier}
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <Select onValueChange={(value) => setViewMode(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Como deseja assistir?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="list">Lista Única</SelectItem>
                    <SelectItem value="page">Paginada</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {viewMode === "page" && (
                <div className="flex gap-2 md:gap-4">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="bg-primary hover:bg-primary-foreground text-white px-2 md:px-4 py-2 rounded disabled:bg-green-300"
                  >
                    Página Anterior
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={
                      currentPage === (readingData?.images?.length || 0) - 1
                    }
                    className="bg-primary hover:bg-primary-foreground text-white px-2 md:px-4 py-2 rounded disabled:bg-green-300"
                  >
                    Próxima Página
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex flex-col items-center justify-center mt-24 space-y-4">
          {loading ? (
            <LottieLoad />
          ) : (
            <>
              {readingData?.images && viewMode === "page" && (
                <div className="w-full max-w-md md:w-660 h-auto md:h-1200 mx-auto">
                  <img
                    src={readingData?.images[currentPage]}
                    alt={`Manga page ${currentPage + 1}`}
                    className="object-cover w-full h-full rounded-lg shadow-lg"
                  />
                </div>
              )}
              {readingData?.images &&
                viewMode === "list" &&
                readingData.images.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="w-full max-w-md md:w-660 h-auto md:h-1200 mx-auto"
                  >
                    <img
                      src={image}
                      alt={`Manga page ${index + 1}`}
                      className="object-cover w-full h-full rounded-lg shadow-lg"
                    />
                  </div>
                ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MangaReader;
