import "ol/ol.css";
import { RLayerTile, RLayerVectorTile, RMap } from "rlayers";
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

export default function EconomicData() {
  const [view, setView] = useState<RView>({
    center: [-11087207.298375694, 4659260.145017052],
    zoom: 4.013145380694064,
    resolution: 9695.196372827555,
  });
  const [search, setSearch] = useState("");

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
      <div className="w-1/2 h-[100vh] justify-center">
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
        </RMap>
        <div className="absolute top-[15px] translate-x-[50%] w-1/4 bg-slate-50 rounded-md text-slate-900">
          <Input
            placeholder="Search by anything..."
            value={search}
            onInput={handleSearch}
            className="border-slate-100"
          ></Input>
        </div>
        <div className="absolute top-[15px] left-[15px] rounded-md text-slate-900">
          <Button className="p-2" onClick={handleGoBack}>
            <ArrowBack className="h-4 w-4 " />
          </Button>
        </div>
      </div>
      <div className="w-1/2 h-[100vh] justify-center items-center text-center gap-6 p-4">
        <h2 className="text-6xl font-bold">Stats</h2>
      </div>
    </div>
  );
}
