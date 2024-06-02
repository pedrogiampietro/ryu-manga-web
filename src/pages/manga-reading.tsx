import * as React from "react";
import { BookOpen, Bookmark, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { MangaDisplay } from "@/app/(app)/examples/manga/components/manga-display"
// import { MangaList } from "@/app/(app)/examples/manga/components/manga-list"
// import { Nav } from "@/app/(app)/examples/manga/components/nav"
// import { type Manga } from "@/app/(app)/examples/manga/data"
// import { useManga } from "@/app/(app)/examples/manga/use-manga"

interface MangaProps {
  //   mangas: Manga[]
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Manga({
  //   mangas,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MangaProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  //   const [manga] = useManga()

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed) => {
            setIsCollapsed(collapsed);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              collapsed
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <Separator />
          {/* <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "All Manga",
                label: "128",
                icon: BookOpen,
                variant: "default",
              },
              {
                title: "Bookmarked",
                label: "9",
                icon: Bookmark,
                variant: "ghost",
              },
            ]}
          /> */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Manga List</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All Manga
                </TabsTrigger>
                <TabsTrigger
                  value="bookmarked"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Bookmarked
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              {/* <MangaList items={mangas} /> */}
            </TabsContent>
            <TabsContent value="bookmarked" className="m-0">
              {/* <MangaList items={mangas.filter((item) => item.bookmarked)} /> */}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          {/* <MangaDisplay
            manga={mangas.find((item) => item.id === manga.selected) || null}
          /> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
