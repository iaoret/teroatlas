import { Q7SearchResults, Q7DashboardData } from "@/interfaces";
import { Separator } from "./ui/separator";

export default function Q7Dashboard(props: {
  dashboardData: Q7DashboardData;
  searchResults: Q7SearchResults;
}) {
  if (!props.dashboardData.q7BoundingBox) {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        The data for this industry is not available for this geography.
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-center mt-4 mb-4">
        {props.dashboardData.chartInfo.title}
      </h2>
      {props.searchResults.breadth.naics === `31---` && (
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-500">
          Industry: Manufacturing
        </h2>
      )}
      <Separator className="mt-4 mb-4" />
      <div className="text-center">
        <h2 className="text-8xl font-bold text-tero-100">
          {(props.dashboardData.q7Totals.total_emp || 0).toLocaleString(
            "en-US"
          )}
        </h2>
        <h2 className="text-xl font-semibold text-tero-100 mt-1">Employees</h2>
      </div>
      <div className="text-center">
        <h2 className="text-8xl font-bold">
          {(props.dashboardData.q7Totals.total_est || 0).toLocaleString(
            "en-US"
          )}
        </h2>
        <h2 className="text-xl font-semibold mt-1">Establishments</h2>
      </div>
      <h2 className="text-xs italic text-slate-600 text-center mt-4 w-[80%]">
        Calculated using data from ZIP Codes within target geography in the year
        of 2022 for the NAICS code {props.searchResults.breadth.naics}{" "}
        {props.searchResults.breadth.naics === `31---` ? "(Manufacturing)" : ""}
      </h2>
    </div>
  );
}
