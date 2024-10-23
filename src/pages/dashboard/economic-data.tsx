/* eslint-disable @typescript-eslint/no-unused-vars */
import "ol/ol.css";
import { RControl, RLayerTile, RMap } from "rlayers";
//@ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ROSM'.
import { RView } from "rlayers/RMap";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import environment from "@/environments";
import { Button } from "@/components/ui/button";
import { ArrowBack } from "@/components/icons/arrow-back";
import { useNavigate } from "react-router-dom";
import { SearchIcon, XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { parseBox } from "@/lib/parseBox";
import { Separator } from "@/components/ui/separator";
import {
  Q1DashboardData,
  Q1Top10BySubUnit,
  Q1Totals,
  Q1SearchResults,
} from "@/interfaces";
import Q1Map from "@/components/q1-map";
import Q1Dashboard from "@/components/q1-dashboard";
import DashboardBarChart from "@/components/dashboard-bar-chart";
import Q1SearchMatrix from "@/components/q1-search-matrix";
import DashboardSkeleton from "@/components/dashboard-skeleton";
import DashboardStart from "@/components/dashboard-start";
import DropdownCustomizeDataDisplay from "@/components/dropdown-customize-data-display";
import DropdownExportData from "@/components/dropdown-export-data";

export default function EconomicData() {
  const mapRef = useRef<RMap>(null);
  const [search, setSearch] = useState(
    "dc congressional district economic data"
  );

  const [searchResults, setSearchResults] = useState<Q1SearchResults>({
    length: null,
    time: { years: [2019, 2020, 2021, 2022] },
    intensity: {
      variable: "emp",
      order: "desc",
    },
    breadth: null,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [dashboardData, setDashboardData] = useState<
    Q1DashboardData | undefined
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

  function clearSearch(e?: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e) e.preventDefault();
    setSearch("");
    setShowDashboard(false);
    setIsSearching(false);
    setDashboardData(undefined);
  }

  function handleGoBack() {
    navigate(-1);
  }

  function whatDashboardToRender(search: string) {
    if (
      search.includes("dc") &&
      search.includes("congressional district") &&
      search.includes("economic data")
    ) {
      return "q1";
    }
    return undefined;
  }

  const dashboardKey = whatDashboardToRender(search);

  const buildDashboardQ1 = useCallback(async () => {
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

        const choropleticData = await fetch(
          environment.urlRest + `/rpc/get_min_max_emp_est`
        ).then(async (res) => res.json());

        setDashboardData({
          q1Totals: q1Totals,
          q1Top10BySubUnit: q1Top10BySubUnit,
          boundingBox: boundingBox,
          choroplethicData: {
            minEmp: choropleticData[0].min_emp,
            maxEmp: choropleticData[0].max_emp,
            minEst: choropleticData[0].min_est,
            maxEst: choropleticData[0].max_est,
          },
          chartInfo: "",
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

  const buildDashboard = useCallback(
    async (key: string | undefined) => {
      if (!key) return;
      if (key === "q1") {
        await buildDashboardQ1();
      }
    },
    [buildDashboardQ1]
  );

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

      if (e.key === `Enter` && isSearching) {
        buildDashboard(dashboardKey);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [buildDashboard, dashboardKey, isSearching, search]);

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
          <Q1Map dashboardData={dashboardData} searchResults={searchResults} />
          <RControl.RCustom
            className={`top-[15px] left-[15px] min-w-full flex flex-row bg-transparent gap-[15px] `}
          >
            <Button
              className="p-2 w-[36px] h-[36px] flex justify-center"
              onClick={handleGoBack}
            >
              <ArrowBack className="h-4 w-4" />
            </Button>
            <Dialog
              open={isSearching}
              onOpenChange={() => setIsSearching(!isSearching)}
            >
              <DialogTitle className="sr-only">Search by anything</DialogTitle>
              <DialogTrigger className="min-w-full pr-[90px] bg-transparent hover:outline-none outline-none h-full">
                <div className="w-full h-full flex flex-row gap-2 justify-center">
                  <div
                    className={` bg-slate-100 hover:bg-slate-200 hover:bg-opacity-90 transition-all duration-150
                     border-slate-400 rounded-lg shadow w-full md:w-2/3 lg:w-1/3 ${
                       search ? "w-auto" : ""
                     }
                     hover:shadow-sm hover:outline-1 outline-1 pr-4 pl-4 pt-2 pb-2 m-[1px]
                     text-sm font-light text-left italic flex flex-row items-center gap-2 min-h-full`}
                  >
                    <SearchIcon className="h-4 w-4 text-slate-600" />
                    {!search && "Search by anything (Ctrl + F or K)"}
                    {search && (
                      <p className="font-light text-left italic text-slate-600 leading-tight w-full text-nowrap truncate">
                        Searching by "{search}"
                      </p>
                    )}
                    {search && (
                      <div
                        onClick={clearSearch}
                        className="hover:cursor-pointer"
                      >
                        <XIcon className="h-4 w-4 text-slate-600 hover:text-gray-900" />
                      </div>
                    )}
                  </div>
                  {showDashboard && (
                    <Button className="w-auto"> Modify Filters</Button>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[90%] md:max-w-2/3  w-[90%] md:w-2/3">
                <DialogHeader>
                  <DialogDescription>
                    <Input
                      placeholder="Search by anything"
                      value={search}
                      onInput={handleSearch}
                      autoFocus
                      className="text-nowrap"
                    ></Input>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center min-w-[50vw]">
                  {loading && !dashboardKey && (
                    <Skeleton className="min-w-[100%] w-full h-[500px]" />
                  )}
                  {dashboardKey === "q1" && (
                    <Q1SearchMatrix
                      buildDashboard={() => buildDashboard(dashboardKey)}
                      setSearchResults={setSearchResults}
                      searchResults={searchResults}
                    />
                  )}
                  {!dashboardKey && !loading && <>No results found</>}
                </div>
              </DialogContent>
            </Dialog>
          </RControl.RCustom>
          <RControl.RCustom className="right-0 w-4 bg-primary-foreground h-full rounded-r-none rounded-l-lg shadow-lg shadow-black flex justify-center items-center"></RControl.RCustom>
        </RMap>
      </div>
      <div
        className={`${
          showDashboard ? "w-[50vw] min-w-[50vw]" : "w-[200px] min-w-[200px]"
        } transition-all duration-200 flex flex-col justify-center z-20  bg-primary-foreground`}
      >
        {!showDashboard && <DashboardStart />}
        {showDashboard && loading && <DashboardSkeleton />}
        {showDashboard && !loading && (
          <div className="w-full flex flex-col justify-between items-center pt-4 pb-4 max-h-[100vh] h-[100vh] overflow-y-auto">
            {showDashboard && dashboardData && (
              <Q1Dashboard
                dashboardData={dashboardData}
                searchResults={searchResults}
              />
            )}

            <Separator className="mt-4 mb-4" />

            <div className={"w-full flex flex-col items-center justify-center"}>
              <DropdownCustomizeDataDisplay />
            </div>

            {dashboardData && (
              <DashboardBarChart
                chartInfo={`Ordered by the
              ${
                searchResults.intensity.order === "desc" ? "highest" : "lowest"
              } value of
              ${
                searchResults.intensity.variable === "est"
                  ? "establishments"
                  : "employees"
              }
              `}
                data={dashboardData.q1Top10BySubUnit}
                dataKeyXAxis="zip"
                dataKeyBar="total"
              />
            )}

            <Separator className="mt-4 mb-4" />

            <DropdownExportData />
          </div>
        )}
      </div>
    </div>
  );
}
