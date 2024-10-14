/* eslint-disable @typescript-eslint/no-unused-vars */
import "ol/ol.css";
import { RControl, RLayerTile, RLayerVectorTile, RMap } from "rlayers";
//@ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ROSM'.
import { RView } from "rlayers/RMap";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { MVT } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import environment from "@/environments";
import { Button } from "@/components/ui/button";
import { ArrowBack } from "@/components/icons/arrow-back";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronLeft, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import SearchMatrix from "@/components/search-matrix";
import { Skeleton } from "@/components/ui/skeleton";
import { parseBox } from "@/lib/parseBox";
import { Extent, getCenter } from "ol/extent";
import { Separator } from "@/components/ui/separator";

interface Q1Totals {
  total_emp: number;
  total_est: number;
}

interface Q1Top10BySubUnit {
  zip: number;
  name: string;
  total: number;
}

export default function EconomicData() {
  const mapRef = useRef<RMap>(null);
  const [search, setSearch] = useState(
    "dc congressional district economic data"
  );

  const [searchResults, setSearchResults] = useState({
    length: {},
    time: { years: [2019, 2020, 2021, 2022] },
    intensity: {
      variable: "emp",
      order: "desc",
    },
    breadth: {},
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [dashboardData, setDashboardData] = useState<
    | {
        boundingBox: number[];
        q1Totals: Q1Totals[];
        q1Top10BySubUnit: Q1Top10BySubUnit[];
      }
    | undefined
  >();

  const navigate = useNavigate();

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

  const buildDashboard = useCallback(async () => {
    async function fetchData() {
      try {
        const q1Totals: Q1Totals[] = await fetch(
          environment.urlRest +
            `/rpc/get_total_emp_est_by_district_and_years?district_id=1&years_set={${searchResults.time.years.join(
              ","
            )}}`
        ).then((res) => res.json());

        const q1Top10BySubUnit: Q1Top10BySubUnit[] = await fetch(
          environment.urlRest +
            `/rpc/get_top_10_zip_codes?district_id=1&years_set={${searchResults.time.years.join(
              ","
            )}}&variable=${searchResults.intensity.variable}&order_direction=${
              searchResults.intensity.order
            }`
        ).then((res) => res.json());

        const boundingBox: number[] = await fetch(
          environment.urlRest + `/rpc/get_q1_extent`
        ).then(async (res) => parseBox(await res.text()));

        setDashboardData({
          q1Totals: q1Totals,
          q1Top10BySubUnit: q1Top10BySubUnit,
          boundingBox: boundingBox,
        });

        return {
          q1Totals: q1Totals,
          q1Top10BySubUnit: q1Top10BySubUnit,
          boundingBox: boundingBox,
        };
      } catch (error) {
        console.error(error);
      }
    }

    setLoading(true);
    setIsSearching(false);
    setShowDashboard(true);
    const data = await fetchData();
    if (mapRef.current && data?.boundingBox) {
      console.log(mapRef.current.ol);
      console.log(data.boundingBox);
      mapRef.current.ol.getView().fit(data?.boundingBox, {
        size: mapRef.current.ol.getSize(),
        duration: 1000,
        padding: [50, 50, 50, 50],
        callback: () => console.log("just fitted"),
      });
    }
    setLoading(false);
  }, [
    searchResults.intensity.order,
    searchResults.intensity.variable,
    searchResults.time.years,
  ]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "f" || e.key === "k") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearching((isSearching) => !isSearching);
      }

      if (e.key === "Escape" && isSearching) {
        e.preventDefault();
        clearSearch();
      }

      if (
        e.key === `Enter` &&
        search.includes("dc") &&
        search.includes("congressional district") &&
        search.includes("economic data") &&
        isSearching
      ) {
        buildDashboard();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [buildDashboard, isSearching, search]);

  return (
    <div className="flex flex-row w-[100vw] min-h-full">
      <div className="w-full h-[100vh] justify-center z-10">
        <RMap
          ref={mapRef}
          initial={{
            center: [-11087207.298375694, 4659260.145017052],
            zoom: 4.013145380694064,
            resolution: 9695.196372827555,
          }}
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
              <DialogTitle className="sr-only">Search by anything</DialogTitle>
              <DialogTrigger className="w-full h-full flex flex-row items-center justify-between rounded-md pl-2  max-w-full max-h-full text-ellipsis overflow-hidden word">
                <div className="flex flex-row w-full h-full items-center gap-2">
                  <Search className="h-4 w-4 " />
                  {search === "" ? (
                    <p className="font-light text-left italic text-slate-600">
                      Search by anything (Ctrl + F or K)
                    </p>
                  ) : (
                    <p className="font-light text-left italic text-slate-600 leading-tight">
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
          {/* <RControl.RCustom
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
          </RControl.RCustom> */}
        </RMap>
      </div>
      <div
        className={`${
          showDashboard ? "w-[50vw] min-w-[50vw]" : "w-[200px] min-w-[200px]"
        } transition-all duration-200 flex flex-col justify-center z-20  bg-primary-foreground`}
      >
        {!showDashboard && (
          <div className="p-4 flex flex-col ">
            <h2 className="text-8xl font-bold  text-tero-100">24</h2>
            <h2 className="text-1xl  font-semibold text-tero-100">
              Dashboards Available
            </h2>
            <p className="">
              Type anything on the searchbar to navigate between dashboards
            </p>
          </div>
        )}
        {showDashboard && loading && (
          <div className="flex flex-col justify-center items-center gap-4">
            <Skeleton className="w-2/3 h-[50px]" />
            <Separator />
            <Skeleton className="w-full h-[100px]" />
            <Skeleton className="w-1/2 h-[30px]" />
            <Skeleton className="w-full h-[100px]" />
            <Skeleton className="w-1/2 h-[30px]" />
            <Skeleton className="w-full h-[30px]" />
            <Separator />
            <Skeleton className="w-1/3 h-[60px]" />
            <Skeleton className="w-full h-[400px]" />
            <Separator />
            <Skeleton className="h-[50px] w-1/2" />
          </div>
        )}
        {showDashboard && !loading && (
          <div className="w-full flex flex-col justify-between items-center pt-4 pb-4 max-h-[100vh] h-[100vh] overflow-y-auto">
            {showDashboard && dashboardData?.q1Totals && (
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-2xl font-semibold text-center mt-4 mb-4">
                  District of Columbia (Congressional District)
                </h2>

                <Separator className="mt-4 mb-4" />
                <div className="text-center">
                  <h2 className="text-8xl font-bold text-tero-100">
                    {dashboardData.q1Totals[0].total_emp.toLocaleString(
                      "en-US"
                    )}
                  </h2>
                  <h2 className="text-xl font-semibold text-tero-100 mt-1">
                    Employees
                  </h2>
                </div>
                <div className="text-center">
                  <h2 className="text-8xl font-bold">
                    {dashboardData.q1Totals[0].total_est.toLocaleString(
                      "en-US"
                    )}
                  </h2>
                  <h2 className="text-xl font-semibold mt-1">Establishments</h2>
                </div>
                <h2 className="text-xs italic text-slate-600 text-center mt-4">
                  Calculated using data from 54 ZIP Codes within target
                  geography
                </h2>
              </div>
            )}

            <Separator className="mt-4 mb-4" />

            <div className={"w-full flex flex-col items-center justify-center"}>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:border-slate-400 transition-all duration-200 text-sm flex flex-row items-center justify-center">
                  Customize Data Display &nbsp;{" "}
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Data Table Preview
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Top 10 Observations by Unit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Top 10 Observations by Sub-Unit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Value Over Time
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <h2 className="text-2xl font-bold">
                Top 10 Observations by Sub-Unit
              </h2>

              <p className="text-xs italic text-slate-600">
                Ordered by the{" "}
                {searchResults.intensity.order === "desc" && "highest"}{" "}
                {searchResults.intensity.order === "asc" && "lowest"} value of{" "}
                {searchResults.intensity.variable === "est" && "establishments"}
                {searchResults.intensity.variable === "emp" && "employees"}
              </p>
              {dashboardData?.q1Top10BySubUnit && (
                <ChartContainer
                  config={{
                    desktop: {
                      label: "Desktop",
                      color: "#2563eb",
                    },
                    mobile: {
                      label: "Mobile",
                      color: "#60a5fa",
                    },
                  }}
                  className="h-full w-full mt-4 mb-4"
                >
                  <BarChart
                    width={400}
                    height={500}
                    data={dashboardData.q1Top10BySubUnit}
                  >
                    <Bar dataKey={"total"} fill={"#4285F4"} />
                    <XAxis dataKey="zip" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                  </BarChart>
                </ChartContainer>
              )}
            </div>

            <Separator className="mt-4 mb-4" />
            <DropdownMenu>
              <DropdownMenuTrigger className="border-2 border-slate-600 hover:border-slate-400 transition-all duration-200">
                Export Data
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="hover:cursor-pointer">
                  to .CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer">
                  to .XLSX
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer">
                  to .PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
