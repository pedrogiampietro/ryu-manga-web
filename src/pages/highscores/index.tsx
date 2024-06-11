import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "@/components/theme-switch";
import { UserNav } from "@/components/user-nav";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { apiClient } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/top-nav";
import { topNav } from "@/lib/topNav";
import { Sidebar } from "@/components/sidebar";
import useIsCollapsed from "@/hooks/useIsCollapsed";
import Combobox from "@/components/ui/combobox";
import podiumImage from "@/assets/podium.png";
import border1St from "@/assets/border-1st.png";
import border2St from "@/assets/border-2st.png";
import border3St from "@/assets/border-3st.png";
import ReactCurvedText from "react-curved-text";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { LottieLoad } from "@/components/custom/loading";

const Highscores: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [highscores, setHighscores] = useState<any>([]);
  const [loadingHighscores, setLoadingHighscores] = useState(false);

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoadingFavorites(true);
    const { data } = await apiClient().get(`/v1/favorites`, {
      params: { userId: user?.userId },
    });

    setFavorites(data);
    setLoadingFavorites(false);
  };

  const fetchHighscores = async () => {
    setLoadingHighscores(true);
    const { data } = await apiClient().get(`/v1/ranking/highscores-stats`);
    setHighscores(data.body);
    setLoadingHighscores(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchHighscores();
  }, []);

  return (
    <Layout>
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className="ml-auto hidden md:flex items-center space-x-4">
          <Combobox />
          <ThemeSwitch />
          {isAuthenticated ? (
            <UserNav />
          ) : (
            <Button onClick={() => navigate("/auth/login")}>Login</Button>
          )}
        </div>
      </LayoutHeader>

      <div className="md:hidden flex mt-6 px-4">
        <Combobox />
      </div>

      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        loadingFavorites={loadingFavorites}
        favorites={favorites}
        favoritesCallback={fetchFavorites}
      />

      <LayoutBody className="space-y-4 md:ml-64 sm:ml-0">
        <div className="flex items-center gap-3 space-y-2 relative mb-4 font-semibold xl:text-lg">
          <div className="mr-2 h-14 w-1 rounded-md bg-primary md:w-2"></div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ryu Mangás
          </h1>

          <p>Criado por vocês, para vocês 🔥</p>
        </div>

        <div className="relative flex justify-center mt-8">
          <div className="relative w-full max-w-3xl">
            <img src={podiumImage} alt="Podium" className="w-full" />
            {highscores.length > 0 && (
              <div className="absolute inset-0 flex justify-center items-end pb-10">
                <div className="absolute bottom-[10rem] left-1/4 mb-12 w-full text-center flex flex-col items-center">
                  <div
                    style={{
                      backgroundImage: `url(${border1St})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "200px",
                      height: "250px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ position: "relative", top: "60px" }}>
                      <img
                        src={highscores[1]?.avatar}
                        alt="Avatar"
                        className="w-16 h-16s rounded-full"
                      />
                    </div>
                    <div style={{ position: "relative", top: "63px" }}>
                      <h2 id="curvedText" className="text-xl font-bold mt-2">
                        <ReactCurvedText
                          width={370}
                          height={300}
                          cx={188}
                          cy={119}
                          rx={110}
                          ry={98}
                          startOffset={109}
                          reversed={true}
                          text={
                            (highscores[1]?.name.length > 8
                              ? highscores[1]?.name.substring(0, 8) + "..."
                              : highscores[1]?.name) || "2nd Place"
                          }
                          textPathProps={{ fill: "#FFFF" }}
                        />
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[7rem] left-1/1 mb-8 mr-10 w-full text-center flex flex-col items-center">
                  <div
                    style={{
                      backgroundImage: `url(${border2St})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "200px",
                      height: "250px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ position: "relative", top: "60px" }}>
                      <img
                        src={highscores[2]?.avatar}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full"
                      />
                    </div>
                    <div style={{ position: "relative", top: "64px" }}>
                      <h2 id="curvedText" className="text-xl font-bold mt-2">
                        <ReactCurvedText
                          width={370}
                          height={300}
                          cx={188}
                          cy={119}
                          rx={105}
                          ry={103}
                          startOffset={110}
                          reversed={true}
                          text={
                            (highscores[2]?.name.length > 8
                              ? highscores[2]?.name.substring(0, 8) + "..."
                              : highscores[2]?.name) || "2nd Place"
                          }
                          textPathProps={{ fill: "#FFFF" }}
                        />
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 right-1/4 mb-4 w-full text-center flex flex-col items-center">
                  <div
                    style={{
                      backgroundImage: `url(${border3St})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "200px",
                      height: "250px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ position: "relative", top: "64px" }}>
                      <img
                        src={highscores[3]?.avatar}
                        alt="Avatar"
                        className="w-16 h-16s rounded-full"
                      />
                    </div>
                    <div style={{ position: "relative", top: "63px" }}>
                      <h2 id="curvedText" className="text-xl font-bold mt-2">
                        <ReactCurvedText
                          width={370}
                          height={300}
                          cx={188}
                          cy={119}
                          rx={105}
                          ry={97}
                          startOffset={110}
                          reversed={true}
                          text={
                            (highscores[3]?.name.length > 8
                              ? highscores[3]?.name.substring(0, 8) + "..."
                              : highscores[3]?.name) || "2nd Place"
                          }
                          textPathProps={{ fill: "#FFFF" }}
                        />
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Rankings</h2>
          {loadingHighscores ? (
            <LottieLoad />
          ) : (
            <DataTable data={highscores} columns={columns} />
          )}
        </div>
      </LayoutBody>
    </Layout>
  );
};

export default Highscores;
