import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useDebounce } from "../hooks/useDebounce";
import { Link } from "react-router-dom";

const baseUrl = "https://api.mangadex.org";

const fetchSearchResults = async (title) => {
  const response = await axios.get(`${baseUrl}/manga`, {
    params: { title },
  });
  return response.data.data;
};

export function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [showCommand, setShowCommand] = useState(false);
  const [isMouseOverList, setIsMouseOverList] = useState(false);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  const {
    data: searchResults,
    isLoading: loadingSearchResults,
    error,
  } = useQuery({
    queryKey: ["searchResults", debouncedSearchInput],
    queryFn: () => fetchSearchResults(debouncedSearchInput),
    enabled: !!debouncedSearchInput,
  });

  const searchResultsData =
    searchResults?.map((result: any) => {
      return {
        title: result.attributes.title.en,
        apLink: result.attributes.links.ap,
      };
    }) || [];

  return (
    <div className={`relative ${showCommand ? "bg-black bg-opacity-50" : ""}`}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Digite um comando ou pesquise..."
          value={searchInput}
          onChangeCapture={(e) => setSearchInput(e.target.value)}
          onFocus={() => setShowCommand(true)}
          onBlur={() => {
            if (!isMouseOverList) {
              setShowCommand(false);
            }
          }}
        />

        {showCommand && (
          <CommandList
            className="absolute z-10 max-h-48 w-[207px] overflow-y-auto bg-black rounded-lg border shadow-md"
            style={{ top: "calc(100% + 8px)", left: 0 }}
            onMouseEnter={() => setIsMouseOverList(true)}
            onMouseLeave={() => setIsMouseOverList(false)}
          >
            {searchResultsData.length === 0 ? (
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            ) : (
              <CommandGroup heading="Sugestões">
                {searchResultsData.map((data: any, index: number) => (
                  <Link to={`/manga/${data.apLink}`} key={index}>
                    <CommandItem className="cursor-pointer">
                      {data.title}
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
          </CommandList>
        )}
      </Command>
    </div>
  );
}
