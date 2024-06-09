import React, { useState } from "react";
import { TooltipProvider } from "./ui/tooltip";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LottieLoad } from "./custom/loading";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiClient } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface Manga {
  id: string;
  title: string;
  link: string;
  cover: string;
}

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  favorites: { id: number; userId: string; mangaId: string; manga: Manga }[];
  loadingFavorites: boolean;
  favoritesCallback: any;
}

const getInitials = (title: string) => {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export default function Nav({
  favorites,
  isCollapsed,
  className,
  loadingFavorites,
  favoritesCallback,
}: NavProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedManga, setSelectedManga] = useState<any>({});

  const handleDelete = async () => {
    try {
      const response = await apiClient().delete("/v1/favorites", {
        params: {
          userId: user?.userId,
          mangaId: selectedManga.mangaId,
        },
      });
      if (response.status === 204) {
        toast({
          title: "Sucesso!",
          description: "Mangá removido dos favoritos!",
        });

        favoritesCallback();
      }
    } catch (error: any) {
      console.error("Erro ao remover mangá dos favoritos", error);
      toast({
        title: "Não foi possivel remover!",
        description: error.response.message,
      });
    }

    setOpen(false);
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        "group border-b bg-background py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none",
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className="grid gap-2 p-2">
          {loadingFavorites ? (
            <div className="text-center py-4">
              <span className="text-lg font-semibold">
                <LottieLoad />
              </span>
            </div>
          ) : (
            favorites?.map((fav: any) => (
              <div
                key={fav?.manga?.id}
                className="flex items-center bg-transparent dark:bg-zinc-900 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer relative"
                onClick={() => navigate(`/manga/${fav.mangaId}`)}
              >
                <button
                  className={`absolute  ${
                    isCollapsed
                      ? "top-0 right-0"
                      : "top-2 right-2 text-primary hover:text-green-900 transition-colors duration-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedManga(fav);
                    setOpen(true);
                  }}
                >
                  <X size={isCollapsed ? 10 : 14} />
                </button>
                {isCollapsed ? (
                  <div className="flex items-center justify-center w-7 h-7 bg-gray-900 rounded-full text-[10px] text-dark font-bold">
                    {getInitials(fav?.manga?.title)}
                  </div>
                ) : (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${fav?.manga?.cover}`}
                    alt={fav?.manga?.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
                {!isCollapsed && (
                  <div className="ml-2">
                    <h2 className="text-lg font-semibold">
                      {fav?.manga?.title}
                    </h2>
                  </div>
                )}
              </div>
            ))
          )}
        </nav>
      </TooltipProvider>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente
              este mangá de seus favoritos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Deletar{" "}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
