import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Ratings } from "@/components/custom/starRating";
import { Link } from "react-router-dom";

export function CardManga({ manga }: any) {
  return (
    <div className="flex overflow-x-scroll space-x-4 p-4">
      {manga.map((mangaItem: any, i: number) => (
        <Link to={`/manga/${encodeURIComponent(mangaItem.identifier)}`} key={i}>
          <Card className="flex flex-row m-2 shadow-lg w-96 transform transition duration-500 ease-in-out hover:scale-105 cursor-pointer">
            <CardHeader className="w-48 h-full">
              <img
                src={mangaItem.cover}
                alt={mangaItem.name}
                className="w-full h-full object-cover"
              />
            </CardHeader>
            <CardContent className="flex flex-col p-4 space-y-2">
              <CardTitle className="font-bold text-lg">
                {mangaItem.name}
              </CardTitle>
              {manga.rating > 0 ? <Ratings rating={mangaItem?.rating} /> : null}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="name">Último capítulo adicionado</Label>
                <span className="text-sm text-primary">
                  {mangaItem.lastChapter}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="date">Lançado dia:</Label>
                <span className="text-sm text-primary">{mangaItem.date}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
