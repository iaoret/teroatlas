import "ol/ol.css";
import { RControl, RLayerTile, RLayerVectorTile, RMap } from "rlayers";
//@ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ROSM'.
import { RView } from "rlayers/RMap";
import { FormEvent, useState } from "react";
import { MVT } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import { useQuery } from "@tanstack/react-query";
import environment from "@/environments";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBack } from "@/components/icons/arrow-back";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function EconomicData() {
  const [view, setView] = useState<RView>({
    center: [-11087207.298375694, 4659260.145017052],
    zoom: 4.013145380694064,
    resolution: 9695.196372827555,
  });
  const [search, setSearch] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);

  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://api.github.com/repos/TanStack/query").then((res) =>
        res.json()
      ),
  });

  if (error) console.error("Erro ao obter dados da API: ", error);

  function handleSearch(e: FormEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <div className="flex flex-row w-[100vw] min-h-full">
      <div className="w-full h-[100vh] justify-center z-10">
        <RMap
          initial={view}
          view={[view, setView]}
          height={"100%"}
          width={"100%"}
          noDefaultControls
        >
          <RLayerTile url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <RLayerVectorTile
            url={`${environment.urlTiles}/public.q1_tile_function/{z}/{x}/{y}.pbf?years_set={2019,2020,2021}`}
            format={new MVT()}
            style={
              new Style({
                stroke: new Stroke({
                  color: "#00447C",
                  width: 1,
                }),
                fill: new Fill({
                  color: "#00447c50",
                }),
              })
            }
            onClick={(e) => {
              console.log(e.target.getProperties());
            }}
          />
          <RControl.RCustom className="top-[15px] left-[15px] bg-slate-50 rounded-md text-slate-900 z-[1000]">
            <Button
              className="p-2 w-[30px] h-[36px] flex justify-center"
              onClick={handleGoBack}
            >
              <ArrowBack className="h-4 w-4" />
            </Button>
          </RControl.RCustom>
          <RControl.RCustom className="top-[15px] left-[25%] w-1/2 bg-slate-50 rounded-md text-slate-900 z-[1000]">
            <div>
              <Input
                placeholder="Search by anything..."
                value={search}
                onInput={handleSearch}
                className="border-slate-100"
              ></Input>
            </div>
          </RControl.RCustom>
          <RControl.RCustom className="right-0 w-4 bg-primary-foreground h-full rounded-r-none rounded-l-lg shadow-lg shadow-black flex justify-center items-center">
            <div onClick={() => setShowDashboard(!showDashboard)}>
              <ChevronLeft
                className={`${
                  showDashboard ? "rotate-180" : ""
                } transition-all duration-200 hover:cursor-pointer`}
              />
            </div>
          </RControl.RCustom>
        </RMap>
      </div>
      <div
        className={`${
          showDashboard ? "w-[50vw] min-w-[50vw]" : "w-[200px] min-w-[200px]"
        } transition-all duration-200 h-[100vh] flex flex-col justify-center p-4 z-20  bg-primary-foreground`}
      >
        {!showDashboard && (
          <div>
            <h2 className="text-8xl font-bold  text-tero-100">24</h2>
            <h2 className="text-1xl  font-semibold text-tero-100">
              Dashboards Available
            </h2>
            <p className="">
              Type anything on the searchbar to navigate between dashboards
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
