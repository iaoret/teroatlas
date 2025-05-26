import Q1Dashboard from "@/components/q1-dashboard";
import Q2Dashboard from "@/components/q2-dashboard";
import Q3Dashboard from "@/components/q3-dashboard";
import Q4Dashboard from "@/components/q4-dashboard";
import Q1Map from "@/components/q1-map";
import Q2Map from "@/components/q2-map";
import Q3Map from "@/components/q3-map";
import Q4Map from "@/components/q4-map";
import Q1SearchMatrix from "@/components/q1-search-matrix";
import Q2SearchMatrix from "@/components/q2-search-matrix";
import Q3SearchMatrix from "@/components/q3-search-matrix";
import Q4SearchMatrix from "@/components/q4-search-matrix";
import environment from "@/environments";
import { parseBox } from "@/lib/parseBox";
import {
  Q1DashboardData,
  Q1SearchResults,
  Q2DashboardData,
  Q2SearchResults,
  Q3DashboardData,
  Q3SearchResults,
  Q4DashboardData,
  Q4SearchResults,
} from "@/interfaces";
import { RefObject, Dispatch, SetStateAction, ComponentType } from "react";
import { RMap } from "rlayers";

// Define prop types for each dashboard/map/search matrix
export type Q1DashboardProps = {
  dashboardData: Q1DashboardData;
  searchResults: Q1SearchResults;
};
export type Q2DashboardProps = {
  dashboardData: Q2DashboardData;
  searchResults: Q2SearchResults;
};
export type Q3DashboardProps = {
  dashboardData: Q3DashboardData;
  searchResults: Q3SearchResults;
};
export type Q4DashboardProps = {
  dashboardData: Q4DashboardData;
  searchResults: Q4SearchResults;
};
export type Q1MapProps = {
  dashboardData: Q1DashboardData | undefined;
  searchResults: Q1SearchResults;
};
export type Q2MapProps = {
  dashboardData: Q2DashboardData | undefined;
  searchResults: Q2SearchResults;
};
export type Q3MapProps = {
  dashboardData: Q3DashboardData | undefined;
  searchResults: Q3SearchResults;
};
export type Q4MapProps = {
  dashboardData: Q4DashboardData | undefined;
  searchResults: Q4SearchResults;
};
export type Q1SearchMatrixProps = {
  buildDashboard: () => void;
  searchResults: Q1SearchResults;
  setSearchResults: Dispatch<SetStateAction<Q1SearchResults>>;
};
export type Q2SearchMatrixProps = {
  buildDashboard: () => void;
  searchResults: Q2SearchResults;
  setSearchResults: Dispatch<SetStateAction<Q2SearchResults>>;
};
export type Q3SearchMatrixProps = {
  buildDashboard: () => void;
  searchString: string;
  searchResults: Q3SearchResults;
  setSearchResults: Dispatch<SetStateAction<Q3SearchResults>>;
};
export type Q4SearchMatrixProps = {
  buildDashboard: () => void;
  searchString: string;
  searchResults: Q4SearchResults;
  setSearchResults: Dispatch<SetStateAction<Q4SearchResults>>;
};

export interface DashboardRegistryEntry<
  TDashboardData,
  TSearchResults,
  TDashboardProps,
  TMapProps,
  TSearchMatrixProps
> {
  key: string;
  match: (search: string) => boolean;
  DashboardComponent: ComponentType<TDashboardProps>;
  MapComponent: ComponentType<TMapProps>;
  SearchMatrixComponent: ComponentType<TSearchMatrixProps>;
  buildDashboard: (args: {
    setLoading: Dispatch<SetStateAction<boolean>>;
    setIsSearching: Dispatch<SetStateAction<boolean>>;
    setShowDashboard: Dispatch<SetStateAction<boolean>>;
    setDashboardData: Dispatch<SetStateAction<TDashboardData | undefined>>;
    mapRef: RefObject<RMap>;
    searchResults: TSearchResults;
  }) => Promise<void>;
}

export const dashboardRegistry: [
  DashboardRegistryEntry<
    Q1DashboardData,
    Q1SearchResults,
    Q1DashboardProps,
    Q1MapProps,
    Q1SearchMatrixProps
  >,
  DashboardRegistryEntry<
    Q2DashboardData,
    Q2SearchResults,
    Q2DashboardProps,
    Q2MapProps,
    Q2SearchMatrixProps
  >,
  DashboardRegistryEntry<
    Q3DashboardData,
    Q3SearchResults,
    Q3DashboardProps,
    Q3MapProps,
    Q3SearchMatrixProps
  >,
  DashboardRegistryEntry<
    Q4DashboardData,
    Q4SearchResults,
    Q4DashboardProps,
    Q4MapProps,
    Q4SearchMatrixProps
  >
] = [
  {
    key: "q1",
    match: (search: string) =>
      search.includes("dc") &&
      search.includes("congressional district") &&
      search.includes("economic data"),
    DashboardComponent: Q1Dashboard,
    MapComponent: Q1Map,
    SearchMatrixComponent: Q1SearchMatrix,
    buildDashboard: async ({
      setLoading,
      setIsSearching,
      setShowDashboard,
      setDashboardData,
      mapRef,
      searchResults,
    }) => {
      setLoading(true);
      setIsSearching(false);
      setShowDashboard(true);
      try {
        const response = await fetch(environment.urlAPI + "/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: "dc congressional district economic data",
            searchParams: searchResults,
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const result = await response.json();
        setDashboardData(result.data);
        if (mapRef.current && result.data?.boundingBox) {
          mapRef.current.ol.getView().fit(result.data.boundingBox, {
            size: mapRef.current.ol.getSize(),
            duration: 1000,
            padding: [50, 50, 50, 50],
          });
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    },
  },
  {
    key: "q2",
    match: (search: string) =>
      search.includes("new york") &&
      search.includes("manufacturing economic data") &&
      search.includes("1st congressional district"),
    DashboardComponent: Q2Dashboard,
    MapComponent: Q2Map,
    SearchMatrixComponent: Q2SearchMatrix,
    buildDashboard: async ({
      setLoading,
      setIsSearching,
      setShowDashboard,
      setDashboardData,
      mapRef,
      searchResults,
    }) => {
      async function fetchData() {
        try {
          const q2Totals = await fetch(
            environment.urlRest +
              `/rpc/get_total_emp_est_by_district_and_naics_in_nys?district_id=1&naics_code=${searchResults.breadth.naics}`
          ).then((res) => res.json());

          const q2Top10BySubUnit = await fetch(
            environment.urlRest +
              `/rpc/get_top_10_zip_codes_nys_by_district_id_naics_code?district_id=1&naics_code=${searchResults.breadth.naics}&variable=${searchResults.intensity.variable}&order_direction=${searchResults.intensity.order}`
          ).then((res) => res.json());

          const boundingBox = await fetch(
            environment.urlRest + `/rpc/get_q2_extent`
          ).then(async (res) => parseBox(await res.text()));

          const choropleticData = await fetch(
            environment.urlRest +
              `/rpc/get_min_max_emp_est_by_district_and_naics_code_in_nys?district_id=1&naics_code=${searchResults.breadth.naics}`
          ).then(async (res) => res.json());

          const q2Data = await fetch(
            environment.urlRest +
              `/q2_zip_code_econ_data_with_geojson?id_q2_nys_congressional_districts=eq.1&naics=ilike.*${searchResults.breadth.naics}*&limit=100`
          ).then(async (res) => res.json());

          const coverage = await fetch(
            environment.urlRest +
              `/rpc/q2_area_coverage_by_subunits?naics_code=${searchResults.breadth.naics}&district_id=1`
          ).then(async (res) => res.json());

          setDashboardData({
            q2Totals: q2Totals,
            q2Top10BySubUnit: q2Top10BySubUnit,
            q2Data: q2Data,
            boundingBox: boundingBox,
            choroplethicData: {
              minEmp: choropleticData[0].min_emp,
              maxEmp: choropleticData[0].max_emp,
              minEst: choropleticData[0].min_est,
              maxEst: choropleticData[0].max_est,
            },
            chartInfo: "",
            coverage: coverage,
          });

          return {
            q1Totals: q2Totals,
            q1Top10BySubUnit: q2Top10BySubUnit,
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
        });
      }
      setLoading(false);
    },
  },
  {
    key: "q3",
    match: (search: string) =>
      search.includes("dc") &&
      search.includes("jobs per housing unit stats") &&
      search.includes("ward"),
    DashboardComponent: Q3Dashboard,
    MapComponent: Q3Map,
    SearchMatrixComponent: Q3SearchMatrix,
    buildDashboard: async ({
      setLoading,
      setIsSearching,
      setShowDashboard,
      setDashboardData,
      mapRef,
      searchResults,
    }) => {
      async function fetchData() {
        try {
          const q3Totals = await fetch(
            environment.urlRest +
              `/rpc/get_total_emp_and_housing_in_dc_by_ward?ward_identifier=${searchResults.place}`
          ).then((res) => res.json());

          const boundingBox = await fetch(
            environment.urlRest +
              `/rpc/get_q3_extent?ward_identifier=${searchResults.place}`
          ).then(async (res) => parseBox(await res.text()));

          const choropleticData = await fetch(
            environment.urlRest +
              `/rpc/get_min_max_emp_housing_ratio_on_zip_code_by_ward?ward_identifier=${searchResults.place}`
          ).then(async (res) => res.json());

          const q3Data = await fetch(
            environment.urlRest +
              `/q3_dc_zip_codes_est_jobs_wards?ward_name=eq.${searchResults.place}&select=zip,name,emp`
          ).then(async (res) => res.json());

          const coverage = await fetch(
            environment.urlRest +
              `/rpc/q3_area_coverage_by_subunits?ward_identifier=${searchResults.place}`
          ).then(async (res) => res.json());

          setDashboardData({
            q3Totals: q3Totals,
            q3Data: q3Data,
            boundingBox: boundingBox,
            choroplethicData: {
              minRatio: choropleticData[0].min_ratio,
              maxRatio: choropleticData[0].max_ratio,
            },
            chartInfo: "",
            coverage: coverage,
          });

          return {
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
        });
      }
      setLoading(false);
    },
  },
  {
    key: "q4",
    match: (search: string) =>
      search.includes("nyc") &&
      search.includes("lowest gross income as full market value") &&
      search.includes("borough block"),
    DashboardComponent: Q4Dashboard,
    MapComponent: Q4Map,
    SearchMatrixComponent: Q4SearchMatrix,
    buildDashboard: async ({
      setLoading,
      setIsSearching,
      setShowDashboard,
      setDashboardData,
      mapRef,
      searchResults,
    }) => {
      async function fetchData() {
        try {
          const q4Data = await fetch(
            environment.urlRest +
              `/q4_nyc_boro_block_economic_data?order=perc_gross_income_as_full_market_value.${searchResults.intensity.order}.nullslast&limit=1`
          ).then((res) => res.json());

          const q4HistoricalData = await fetch(
            environment.urlRest +
              `/rpc/get_perc_gross_income_as_full_market_value_over_the_years?borough_id=${q4Data[0].borough}&block_id=${q4Data[0].block}`
          ).then((res) => res.json());

          const boundingBox = await fetch(
            environment.urlRest +
              `/rpc/get_q4_extent?block_uid=${q4Data[0].uid}`
          ).then(async (res) => parseBox(await res.text()));

          const choropleticData = await fetch(
            environment.urlRest + `/rpc/get_min_max_boro_block_perc_in_nyc`
          ).then(async (res) => res.json());

          setDashboardData({
            q4Data: q4Data,
            q4HistoricalData: q4HistoricalData,
            boundingBox: boundingBox,
            choroplethicData: {
              minPerc:
                choropleticData[0].min_perc_gross_income_as_full_market_value,
              maxPerc:
                choropleticData[0].max_perc_gross_income_as_full_market_value,
            },
            coverage: 1,
          });

          return {
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
        });
      }
      setLoading(false);
    },
  },
];
