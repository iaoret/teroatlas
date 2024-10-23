import { Q1SearchResults, Q1DashboardData } from "@/interfaces";
import { Separator } from "./ui/separator";

export default function Q1Dashboard(props: {
  dashboardData: Q1DashboardData;
  searchResults: Q1SearchResults;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-center mt-4 mb-4">
        District of Columbia (Congressional District)
      </h2>

      <Separator className="mt-4 mb-4" />
      <div className="text-center">
        <h2 className="text-8xl font-bold text-tero-100">
          {props.dashboardData.q1Totals[0].total_emp.toLocaleString("en-US")}
        </h2>
        <h2 className="text-xl font-semibold text-tero-100 mt-1">Employees</h2>
      </div>
      <div className="text-center">
        <h2 className="text-8xl font-bold">
          {props.dashboardData.q1Totals[0].total_est.toLocaleString("en-US")}
        </h2>
        <h2 className="text-xl font-semibold mt-1">Establishments</h2>
      </div>
      <h2 className="text-xs italic text-slate-600 text-center mt-4">
        Calculated using data from 54 ZIP Codes within target geography in the{" "}
        {props.searchResults.time.years.length === 1 ? "year of" : "years"}{" "}
        {props.searchResults.time.years.join(", ")}
      </h2>
    </div>
  );
}
