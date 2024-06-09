import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export function LastReadCard({ manga, isAuthenticated }: any) {
  return (
    <div className="flex overflow-x-scroll space-x-4 p-4">
      {manga?.map((mangaItem: any, i: number) => (
        <Link
          to={`/manga/${encodeURIComponent(
            isAuthenticated ? mangaItem.mangaId : mangaItem.identifier
          )}`}
          key={i}
        >
          <Card className="flex flex-col m-2 shadow-lg w-44 h-60 transform transition duration-500 ease-in-out hover:scale-105 cursor-pointer relative bg-transparent dark:bg-zinc-900">
            <CardHeader className="w-full h-32 relative">
              <img
                src={`${process.env.REACT_APP_API_URL}/${
                  isAuthenticated ? mangaItem.manga.cover : mangaItem.image
                }`}
                alt={isAuthenticated ? mangaItem.manga.title : mangaItem.name}
                className="w-24 h-32 object-cover mx-auto"
              />
            </CardHeader>
            <CardContent className="flex flex-col p-4 space-y-2 m-auto justify-center items-center text-center">
              <div className="flex flex-col">
                <Label htmlFor="name" className="text-xs text-primary mt-3">
                  {isAuthenticated ? mangaItem.manga.title : mangaItem.title}
                </Label>
                <Label htmlFor="name" className="text-xs">
                  {isAuthenticated ? mangaItem.episode : mangaItem.episodio}
                </Label>
              </div>
              <Progress value={mangaItem.progress} />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
