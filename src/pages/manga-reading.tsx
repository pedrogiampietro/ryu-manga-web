import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

const MangaReader = () => {
  const [loading, setLoading] = useState(false);
  const [readingData, setReadingData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("page");
  const { pathname } = useLocation();

  const getMangaDetails = async () => {
    setLoading(true);

    const parts = pathname.split("/");
    const name = parts[2];
    const episodio = parts[3];

    try {
      const { data } = await apiClient().get(
        `/api/ananquim/manga/${name}/${episodio}/read`
      );
      setReadingData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMangaDetails();
  }, [pathname]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
      <header className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Leitor de Mangá</h1>
          <div className="flex items-center gap-4">
            <Select onValueChange={(value) => setViewMode(value)}>
              <SelectTrigger className="w-[180px]">
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
              <div className="flex gap-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                >
                  Página Anterior
                </button>
                <button
                  onClick={nextPage}
                  disabled={
                    currentPage === (readingData?.images?.length || 0) - 1
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                >
                  Próxima Página
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center mt-24">
        {loading ? (
          <LottieLoad />
        ) : (
          <>
            {readingData?.images && viewMode === "page" && (
              <div className="w-660 h-1200 mx-auto">
                <img
                  src={readingData?.images[currentPage]}
                  alt={`Manga page ${currentPage + 1}`}
                  className="object-cover w-full h-full rounded-lg shadow-md"
                />
              </div>
            )}
            {readingData?.images &&
              viewMode === "list" &&
              readingData.images.map((image, index) => (
                <div key={index} className="w-660 h-1200 mx-auto">
                  <img
                    src={image}
                    alt={`Manga page ${index + 1}`}
                    className="object-cover w-full h-full rounded-lg shadow-md"
                  />
                </div>
              ))}
          </>
        )}
      </main>
    </div>
  );
};

export default MangaReader;
