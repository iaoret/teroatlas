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

export const dashboardRegistry = [
  {
    key: "q1",
    match: (search: string) =>
      search.includes("dc") &&
      search.includes("congressional district") &&
      search.includes("economic data"),
    DashboardComponent: Q1Dashboard,
    MapComponent: Q1Map,
    SearchMatrixComponent: Q1SearchMatrix,
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
  },
];
