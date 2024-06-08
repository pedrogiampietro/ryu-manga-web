import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Ratings } from "@/components/custom/starRating";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

export function CardManga({ manga, favoritesCallback }: any) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFavoriteClick = async (
    event: React.MouseEvent,
    mangaItem: any
  ) => {
    event.stopPropagation();
    try {
      const response = await apiClient().post("/v1/favorites", {
        userId: user?.userId,
        mangaId: mangaItem.identifier,
        title: mangaItem.name,
        cover: mangaItem.cover,
      });
      if (response.status === 201) {
        toast({
          title: "Sucesso!",
          description: "Manga adicionado aos favoritos com sucesso!",
        });
        favoritesCallback();
      }
    } catch (error: any) {
      console.error("Erro ao adicionar manga aos favoritos", error);
      toast({
        title: "Não foi possivel favoritar!",
        description: error.response.message,
      });
    }
  };

  return (
    <div className="flex overflow-x-scroll space-x-4 p-4">
      {manga.map((mangaItem: any, i: number) => (
        <Link to={`/manga/${encodeURIComponent(mangaItem.identifier)}`} key={i}>
          <Card className="flex flex-ro ww-96 h-50 m-2 shadow-lg transform transition duration-500 ease-in-out hover:scale-105 cursor-pointer relative bg-transparent dark:bg-zinc-900">
            <CardHeader className="w-48 h-full">
              <img
                src={mangaItem.cover}
                alt={mangaItem.name}
                className="w-30 h-40 object-cover"
              />
            </CardHeader>
            <CardContent className="flex flex-col p-4 space-y-2">
              <CardTitle className="font-bold text-lg">
                {mangaItem.name}
              </CardTitle>
              {mangaItem.rating > 0 ? (
                <Ratings rating={mangaItem?.rating} size={10} />
              ) : null}
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
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="w-6 h-6 flex flex-col justify-between">
                    <EllipsisIcon />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Opções</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(event) => handleFavoriteClick(event, mangaItem)}
                  >
                    Favoritar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
