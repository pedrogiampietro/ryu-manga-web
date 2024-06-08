import { useEffect, useState, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchIcon } from "lucide-react";
import { cn, transformedTitle } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { ArrowUp01, ArrowDown01, LucideHome } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Combobox() {
  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchInput = useDebounce(searchInput, 500);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const baseUrl = "https://api.mangadex.org";

  const fetchSearchResults = async (title: string) => {
    const response = await axios.get(
      `${baseUrl}/manga?limit=4&offset=0&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=`,
      {
        params: { title },
      }
    );
    return response.data.data;
  };

  const { data: searchResults } = useQuery({
    queryKey: ["searchResults", debouncedSearchInput],
    queryFn: () => fetchSearchResults(debouncedSearchInput),
    enabled: !!debouncedSearchInput,
  });

  const searchResultsData =
    searchResults?.map((result: any) => {
      return {
        id: result.id,
        title: result.attributes.title.en,
        apLink: result.attributes.links.ap,
        relationships: result.relationships,
        releaseDate: result.attributes.year,
      };
    }) || [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback((callback: () => unknown) => {
    setIsOpen(false);
    callback();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchInput("");
    }
  }, [isOpen]);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsOpen(true)}
        aria-label="Buscar mangá"
      >
        <SearchIcon className="h-6 w-6" />
        <span className="hidden xl:inline-flex">Buscar mangá...</span>
        <span className="sr-only">Buscar mangá</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Buscar mangá..."
          value={searchInput}
          onValueChange={setSearchInput}
        />
        <CommandList className="mb-10">
          <CommandEmpty
            className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
          >
            No anime found.
          </CommandEmpty>
          {isPending ? (
            <div>Loading...</div>
          ) : searchResultsData ? (
            <CommandGroup className="z-[99999]">
              {searchResultsData?.map((item: any) => {
                console.log("item ->", item);

                let fileName = "";

                if (item.relationships) {
                  item.relationships.forEach((relation: any) => {
                    if (relation.type === "cover_art") {
                      fileName = relation.attributes.fileName;
                    }
                  });
                }

                return (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() =>
                      handleSelect(() => {
                        startTransition(() => {
                          setSearchInput("");
                          navigate(`/manga/${item.apLink}`);
                        });
                      })
                    }
                  >
                    <img
                      src={`https://mangadex.org/covers/${item.id}/${fileName}`}
                      alt={item.title ?? ""}
                      className="mr-4 h-14 w-10 rounded-sm"
                    />
                    <div className="flex flex-col justify-center cursor-pointer">
                      <h3 className="text-sm font-medium leading-none">
                        {item.title}
                      </h3>
                      <p className="text-xs leading-none text-muted-foreground cursor-pointer">
                        {item.releaseDate}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ) : null}

          <div className="fixed inset-x-0 bottom-[-2px] flex items-center gap-1 bg-background p-3 text-muted-foreground/80">
            <div className="flex flex-col">
              <div className="flex w-4 flex-col items-center justify-center rounded-md border p-0.5">
                <ArrowUp01 className="h-2 w-2" />
              </div>
              <div className="h-1 w-4 border-x border-b"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex w-4 flex-col items-center justify-center rounded-md border p-0.5">
                <ArrowDown01 className="h-2 w-2" />
              </div>
              <div className="h-1 w-4 border-x border-b"></div>
            </div>
            <div className="text-xs">to navigate</div>
            <div className="ml-2 flex flex-col">
              <div className="flex w-4 flex-col items-center justify-center rounded-md border p-0.5">
                <LucideHome className="h-2 w-2" />
              </div>
              <div className="h-1 w-4 border-x border-b"></div>
            </div>
            <div className="text-xs">to select</div>

            <div className="ml-2 flex flex-col">
              <div className="flex w-4 flex-col items-center justify-center rounded-md border p-0.5 text-[7px]">
                ESC
              </div>
              <div className="h-1 w-4 border-x border-b"></div>
            </div>
            <div className="text-xs">to exit</div>
          </div>
        </CommandList>
      </CommandDialog>
    </>
  );
}
