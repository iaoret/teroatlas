/* eslint-disable @typescript-eslint/no-unused-vars */
import "ol/ol.css";
import { RControl, RLayerTile, RMap } from "rlayers";
//@ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ROSM'.
import { RView } from "rlayers/RMap";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Q1DashboardData,
  Q1SearchResults,
  Q2SearchResults,
  Q2DashboardData,
  Q3SearchResults,
  Q3DashboardData,
  Q4SearchResults,
  Q4DashboardData,
  Q6DashboardData,
  Q6SearchResults,
} from "@/interfaces";
import DashboardBarChart from "@/components/dashboard-bar-chart";
import DashboardSkeleton from "@/components/dashboard-skeleton";
import DashboardStart from "@/components/dashboard-start";
import DropdownCustomizeDataDisplay from "@/components/dropdown-customize-data-display";
import DropdownExportData from "@/components/dropdown-export-data";
import { DashboardTable } from "@/components/dashboard-table";
import DashboardLineChart from "@/components/dashboard-line-chart";
import { dashboardRegistry } from "./dashboard-registry";
import environment from "@/environments";
import Q6SearchMatrix from "@/components/q6-search-matrix";
import Q6Dashboard from "@/components/q6-dashboard";

function getDashboardConfig(search: string) {
  const lower = search.toLowerCase();
  return dashboardRegistry.find((d) => d.match(lower));
}

export default function EconomicData() {
  const mapRef = useRef<RMap>(null);
  const [search, setSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  const [q1SearchResults, setQ1SearchResults] = useState<Q1SearchResults>({
    length: null,
    time: { years: [2019, 2020, 2021, 2022] },
    intensity: {
      variable: "emp",
      order: "desc",
    },
    breadth: null,
  });
  const [q2SearchResults, setQ2SearchResults] = useState<Q2SearchResults>({
    length: null,
    time: null,
    intensity: {
      variable: "aprox_emp",
      order: "desc",
    },
    breadth: {
      naics: "31---",
    },
  });
  const [q3SearchResults, setQ3SearchResults] = useState<Q3SearchResults>({
    place: null,
    length: null,
    time: null,
    intensity: {
      variable: "ratio",
      order: "desc",
    },
    breadth: null,
  });
  const [q4SearchResults, setQ4SearchResults] = useState<Q4SearchResults>({
    length: null,
    time: { years: [2019, 2020, 2021, 2022] },
    intensity: {
      variable: "perc_gross_income_as_full_market_value",
      order: "desc",
    },
    breadth: null,
  });
  const [q6SearchResults, setQ6SearchResults] = useState<Q6SearchResults>({
    length: null,
    time: null,
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
  const [q1DashboardData, setQ1DashboardData] = useState<
    Q1DashboardData | undefined
  >();
  const [q2DashboardData, setQ2DashboardData] = useState<
    Q2DashboardData | undefined
  >();
  const [q3DashboardData, setQ3DashboardData] = useState<
    Q3DashboardData | undefined
  >();
  const [q4DashboardData, setQ4DashboardData] = useState<
    Q4DashboardData | undefined
  >();
  const [q6DashboardData, setQ6DashboardData] = useState<
    Q6DashboardData | undefined
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
    setQ1DashboardData(undefined);
    setQ2DashboardData(undefined);
  }

  function handleGoBack() {
    navigate(-1);
  }

  const dashboardConfig = getDashboardConfig(search);
  const dashboardKey = dashboardConfig?.key;

  const buildDashboard = useCallback(async () => {
    if (!dashboardKey) return;
    if (dashboardKey === "q1") {
      await dashboardRegistry[0].buildDashboard({
        searchString: search,
        setLoading,
        setIsSearching,
        setShowDashboard,
        setDashboardData: setQ1DashboardData,
        mapRef,
        searchResults: q1SearchResults,
      });
    } else if (dashboardKey === "q2") {
      await dashboardRegistry[1].buildDashboard({
        searchString: search,
        setLoading,
        setIsSearching,
        setShowDashboard,
        setDashboardData: setQ2DashboardData,
        mapRef,
        searchResults: q2SearchResults,
      });
    } else if (dashboardKey === "q3") {
      await dashboardRegistry[2].buildDashboard({
        searchString: search,
        setLoading,
        setIsSearching,
        setShowDashboard,
        setDashboardData: setQ3DashboardData,
        mapRef,
        searchResults: q3SearchResults,
      });
    } else if (dashboardKey === "q4") {
      await dashboardRegistry[3].buildDashboard({
        searchString: search,
        setLoading,
        setIsSearching,
        setShowDashboard,
        setDashboardData: setQ4DashboardData,
        mapRef,
        searchResults: q4SearchResults,
      });
    } else if (dashboardKey === "q6") {
      await dashboardRegistry[4].buildDashboard({
        searchString: search,
        setLoading,
        setIsSearching,
        setShowDashboard,
        setDashboardData: setQ6DashboardData,
        mapRef,
        searchResults: q6SearchResults,
      });
    }
  }, [
    dashboardKey,
    q1SearchResults,
    q2SearchResults,
    q3SearchResults,
    q4SearchResults,
    q6SearchResults,
    search,
  ]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (!search) {
      setSearchSuggestions([]);
      return;
    }
    setLoading(true);
    debounceTimeout.current = setTimeout(() => {
      fetch(
        environment.urlAPI + `/suggestions?query=${encodeURIComponent(search)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSearchSuggestions(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setSearchSuggestions([]);
          setLoading(false);
        });
    }, 300);
  }, [search]);

  const shouldShowSuggestions =
    search !== "" &&
    search !== undefined &&
    searchSuggestions &&
    searchSuggestions.length > 0 &&
    (searchSuggestions.length !== 1 || searchSuggestions[0] !== search);

  const coverage =
    Math.floor(
      ((dashboardKey === "q1"
        ? q1DashboardData?.coverage
        : dashboardKey === "q2"
        ? q2DashboardData?.coverage
        : dashboardKey === "q3"
        ? q3DashboardData?.coverage
        : dashboardKey === "q4"
        ? q4DashboardData?.coverage
        : dashboardKey === "q6"
        ? q6DashboardData?.coverage
        : 0) || 0) * 10000
    ) / 100;

  // Assign registry components to variables for JSX usage
  const Q1Map = dashboardRegistry[0].MapComponent;
  const Q2Map = dashboardRegistry[1].MapComponent;
  const Q3Map = dashboardRegistry[2].MapComponent;
  const Q4Map = dashboardRegistry[3].MapComponent;
  const Q6Map = dashboardRegistry[4].MapComponent;
  const Q1SearchMatrix = dashboardRegistry[0].SearchMatrixComponent;
  const Q2SearchMatrix = dashboardRegistry[1].SearchMatrixComponent;
  const Q3SearchMatrix = dashboardRegistry[2].SearchMatrixComponent;
  const Q4SearchMatrix = dashboardRegistry[3].SearchMatrixComponent;
  const Q6SearchMatrix = dashboardRegistry[4].SearchMatrixComponent;
  const Q1Dashboard = dashboardRegistry[0].DashboardComponent;
  const Q2Dashboard = dashboardRegistry[1].DashboardComponent;
  const Q3Dashboard = dashboardRegistry[2].DashboardComponent;
  const Q4Dashboard = dashboardRegistry[3].DashboardComponent;
  const Q6Dashboard = dashboardRegistry[4].DashboardComponent;

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
          {dashboardKey === "q1" && (
            <Q1Map
              dashboardData={q1DashboardData}
              searchResults={q1SearchResults}
            />
          )}
          {dashboardKey === "q2" && (
            <Q2Map
              dashboardData={q2DashboardData}
              searchResults={q2SearchResults}
            />
          )}
          {dashboardKey === "q3" && (
            <Q3Map
              dashboardData={q3DashboardData}
              searchResults={q3SearchResults}
            />
          )}
          {dashboardKey === "q4" && (
            <Q4Map
              dashboardData={q4DashboardData}
              searchResults={q4SearchResults}
            />
          )}
          {dashboardKey === "q6" && (
            <Q6Map
              dashboardData={q6DashboardData}
              searchResults={q6SearchResults}
              mapRef={mapRef}
            />
          )}
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
                  <DialogDescription className="flex flex-col gap-0">
                    <Input
                      placeholder="Search by anything"
                      value={search}
                      onInput={handleSearch}
                      autoFocus
                      className="text-nowrap"
                    />
                    <div className="w-full h-full max-h-[200px] overflow-y-auto">
                      {shouldShowSuggestions &&
                        searchSuggestions.map((suggestion) => (
                          <div
                            className="w-full pl-3 pr-3 pt-1 pb-1 truncate hover:bg-gray-700 hover:cursor-pointer"
                            onClick={() => setSearch(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center min-w-[50vw]">
                  {loading && !dashboardKey && (
                    <Skeleton className="min-w-[100%] w-full h-[500px]" />
                  )}
                  {dashboardKey === "q1" && (
                    <Q1SearchMatrix
                      buildDashboard={buildDashboard}
                      setSearchResults={setQ1SearchResults}
                      searchResults={q1SearchResults}
                    />
                  )}
                  {dashboardKey === "q2" && (
                    <Q2SearchMatrix
                      buildDashboard={buildDashboard}
                      setSearchResults={setQ2SearchResults}
                      searchResults={q2SearchResults}
                    />
                  )}
                  {dashboardKey === "q3" && (
                    <Q3SearchMatrix
                      buildDashboard={buildDashboard}
                      searchString={search || ""}
                      setSearchResults={setQ3SearchResults}
                      searchResults={q3SearchResults}
                    />
                  )}
                  {dashboardKey === "q4" && (
                    <Q4SearchMatrix
                      buildDashboard={buildDashboard}
                      searchString={search || ""}
                      setSearchResults={setQ4SearchResults}
                      searchResults={q4SearchResults}
                    />
                  )}
                  {dashboardKey === "q6" && (
                    <Q6SearchMatrix
                      buildDashboard={buildDashboard}
                      searchString={search || ""}
                      setSearchResults={setQ6SearchResults}
                      searchResults={q6SearchResults}
                    />
                  )}
                  {!dashboardKey && dashboardKey && <></>}
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
            {showDashboard && q1DashboardData && dashboardKey === `q1` && (
              <Q1Dashboard
                dashboardData={q1DashboardData}
                searchResults={q1SearchResults}
              />
            )}

            {showDashboard && q2DashboardData && dashboardKey === `q2` && (
              <Q2Dashboard
                dashboardData={q2DashboardData}
                searchResults={q2SearchResults}
              />
            )}

            {showDashboard && q3DashboardData && dashboardKey === `q3` && (
              <Q3Dashboard
                dashboardData={q3DashboardData}
                searchResults={q3SearchResults}
              />
            )}

            {showDashboard && q4DashboardData && dashboardKey === `q4` && (
              <Q4Dashboard
                dashboardData={q4DashboardData}
                searchResults={q4SearchResults}
              />
            )}

            {showDashboard && q6DashboardData && dashboardKey === `q6` && (
              <Q6Dashboard
                dashboardData={q6DashboardData}
                searchResults={q6SearchResults}
              />
            )}

            <Separator className="mt-4 mb-4" />

            <div className={"w-full flex flex-col items-center justify-center"}>
              <DropdownCustomizeDataDisplay />
            </div>

            {showDashboard && q1DashboardData && dashboardKey === `q1` && (
              <DashboardBarChart
                chartInfo={`Ordered by the
              ${
                q1SearchResults.intensity.order === "desc"
                  ? "highest"
                  : "lowest"
              } value of
              ${
                q1SearchResults.intensity.variable === "est"
                  ? "establishments"
                  : "employees"
              }
              `}
                data={q1DashboardData.q1Top10BySubUnit}
                dataKeyXAxis="zip"
                dataKeyBar="total"
              />
            )}

            {showDashboard && q2DashboardData && dashboardKey === `q2` && (
              <DashboardBarChart
                chartInfo={`Ordered by the
              ${
                q2SearchResults.intensity.order === "desc"
                  ? "highest"
                  : "lowest"
              } value of
              ${
                q2SearchResults.intensity.variable === "est"
                  ? "establishments"
                  : "employees"
              }
              `}
                data={q2DashboardData.q2Top10BySubUnit}
                dataKeyXAxis="zip"
                dataKeyBar="total"
              />
            )}

            {showDashboard && q3DashboardData && dashboardKey === `q3` && (
              <DashboardTable
                data={q3DashboardData.q3Data}
                tableInfo="ZIP Codes within target geography"
              />
            )}

            {showDashboard && q4DashboardData && dashboardKey === `q4` && (
              <DashboardLineChart
                chartInfo={`Evolution of the percentual of gross income as full market value over the years
              `}
                data={q4DashboardData.q4HistoricalData}
                dataKeyXAxis="year"
                dataKeyYAxis="perc_gross_income_as_full_market_value"
              />
            )}

            {showDashboard && q6DashboardData && dashboardKey === `q6` && (
              <DashboardBarChart
                chartInfo={`Ordered by the
              ${
                q6SearchResults.intensity.order === "desc"
                  ? "highest"
                  : "lowest"
              } value of
              ${
                q6SearchResults.intensity.variable === "est"
                  ? "establishments"
                  : "employees"
              }
              `}
                data={q6DashboardData.q6Top10BySubUnit}
                dataKeyXAxis="zip"
                dataKeyBar="total"
              />
            )}

            <Separator className="mt-4 mb-4" />

            {coverage && (
              <h2 className="text-xs italic text-slate-600 text-center mb-3">
                Area from subunits covers {coverage}% of the highlighted unit
              </h2>
            )}
            {coverage && coverage > 0 && coverage !== 100 && (
              <Button
                className="hover:border-slate-400 transition-all duration-200 text-sm flex flex-row items-center justify-center mb-1"
                variant={"ghost"}
              >
                Trim subunits to exact boundaries
              </Button>
            )}
            <DropdownExportData />
          </div>
        )}
      </div>
    </div>
  );
}
