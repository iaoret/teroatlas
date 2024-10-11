import "ol/ol.css";
import { RControl, RLayerTile, RLayerVectorTile, RMap } from "rlayers";
//@ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ROSM'.
import { RView } from "rlayers/RMap";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MVT } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import { useQuery } from "@tanstack/react-query";
import environment from "@/environments";
import { Button } from "@/components/ui/button";
import { ArrowBack } from "@/components/icons/arrow-back";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import SearchMatrix from "@/components/search-matrix";

export default function EconomicData() {
  const [view, setView] = useState<RView>({
    center: [-11087207.298375694, 4659260.145017052],
    zoom: 4.013145380694064,
    resolution: 9695.196372827555,
  });
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();

   
  const { error } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://api.github.com/repos/TanStack/query").then((res) =>
        res.json()
      ),
  });

  if (error) console.error("Erro ao obter dados da API: ", error);

  function handleSearch(e: FormEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    setLoading(true);

    debounceTimeout.current = setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  function clearSearch(e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (e) e.preventDefault();
    setSearch("");
    setShowDashboard(false);
    setIsSearching(false);
  }

  function handleGoBack() {
    navigate(-1);
  }

  function buildDashboard() {
    setIsSearching(false);
    setShowDashboard(true);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      console.log(e);
      if ((e.key === "f" || e.key === "k") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearching((isSearching) => !isSearching);
      }

      if (e.key === "Escape" && isSearching) {
        e.preventDefault();
        clearSearch();
      }

      if (e.key === `Enter` && isSearching) {
        buildDashboard();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isSearching]);

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
              className="p-2 w-[36px] h-[36px] flex justify-center"
              onClick={handleGoBack}
            >
              <ArrowBack className="h-4 w-4" />
            </Button>
          </RControl.RCustom>
          <RControl.RCustom className="top-[15px] left-[50%] translate-x-[-50%] w-1/2 max-w-[80%] h-[36px] bg-slate-50 rounded-md text-slate-900 z-[1000] shadow-sm shadow-gray ">
            <Dialog
              open={isSearching}
              onOpenChange={() => setIsSearching(!isSearching)}
            >
              <DialogTrigger className="w-full h-full flex flex-row items-center justify-between rounded-md pl-2  max-w-full text-ellipsis overflow-hidden word">
                <div className="flex flex-row w-full h-full items-center gap-2">
                  <Search className="h-4 w-4 " />
                  {search === "" ? (
                    <p className="font-light text-left italic text-slate-600">
                      Search by anything (Ctrl + F or K)
                    </p>
                  ) : (
                    <p className="font-light text-left italic text-slate-600">
                      Searching by "{search}"{" "}
                    </p>
                  )}
                </div>
                {search !== "" && (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-transparent hover:text-slate-600 hover:border-transparent"
                    onClick={(e) => clearSearch(e)}
                  >
                    <Cross2Icon className="h-4 w-4" />
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogDescription>
                    <Input
                      placeholder="Search by anything"
                      value={search}
                      onInput={handleSearch}
                      autoFocus
                    ></Input>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center min-w-[50vw]">
                  <SearchMatrix
                    loading={loading}
                    search={search}
                    buildDashboard={buildDashboard}
                  />
                </div>
              </DialogContent>
            </Dialog>
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
          <RControl.RCustom
            className={`${
              showDashboard ? "opacity-100" : "opacity-0"
            } bottom-[15px] left-[25%] w-1/2 z-[1000] shadow-sm shadow-gray transition-all duration-100`}
          >
            <Tabs defaultValue="account" className="min-w-full">
              <TabsList className="grid w-full grid-cols-2 gap-2 p-2">
                <TabsTrigger value="employees" className="w-full">
                  Employees
                </TabsTrigger>
                <TabsTrigger value="establishments" className="w-full">
                  Establishments
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </RControl.RCustom>
        </RMap>
      </div>
      <div
        className={`${
          showDashboard ? "w-[50vw] min-w-[50vw]" : "w-[200px] min-w-[200px]"
        } transition-all duration-200 max-h-[100vh] h-[100vh] overflow-y-auto flex flex-col justify-center p-4 z-20  bg-primary-foreground`}
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
        {showDashboard && (
          <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="font-semibold">
              District of Columbia (Congressional DIstrict)
            </h2>
            <div className="text-center">
              <h2 className="text-8xl font-bold text-tero-100">387.065</h2>
              <h2 className="text-2xl font-bold text-tero-100">Employees</h2>
            </div>
            <div className="text-center">
              <h2 className="text-8xl font-bold">123.456</h2>
              <h2 className="text-2xl font-bold ">Establishments</h2>
            </div>
            <h2 className="text-sm italic m-2">
              Calculated using data from 54 ZIP Codes within target geography
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="border-2 border-slate-600 hover:border-slate-400 transition-all duration-200">
                Customize Data Display
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Data Table Preview</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Top 10 Observations by Unit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Top 10 Observations by Sub-Unit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Value Over Time</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <h2>Value Over Time</h2>
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart
                width={800}
                height={300}
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ChartContainer>

            <DropdownMenu>
              <DropdownMenuTrigger className="border-2 border-slate-600 hover:border-slate-400 transition-all duration-200">
                Export Data
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>to .CSV</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>to .XLSX</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>to .PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];