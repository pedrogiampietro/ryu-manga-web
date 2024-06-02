import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export function LastReadCard({ manga }: any) {
  return (
    <div className="flex overflow-x-scroll space-x-4 p-4">
      {manga.map((mangaItem: any, i: number) => (
        <Link to={`/manga/${encodeURIComponent(mangaItem.identifier)}`} key={i}>
          <Card className="flex flex-col m-2 shadow-lg w-44 transform transition duration-500 ease-in-out hover:scale-105 cursor-pointer">
            <CardHeader className="w-full h-32">
              <img
                src={mangaItem.image}
                alt={mangaItem.name}
                className="w-24 h-32 object-cover mx-auto"
              />
            </CardHeader>
            <CardContent className="flex flex-col p-4 space-y-2 m-auto justify-center">
              <CardTitle className="font-bold text-lg text-center">
                {mangaItem.name}
              </CardTitle>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="name" className="text-xs">
                  {mangaItem.title}
                </Label>
                <span className="text-sm text-primary">
                  {mangaItem.episodio}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
