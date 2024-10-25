import { Q2SearchResults, Q2DashboardData } from "@/interfaces";
import { Separator } from "./ui/separator";

export default function Q2Dashboard(props: {
  dashboardData: Q2DashboardData;
  searchResults: Q2SearchResults;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-center mt-4 mb-4">
        New York State`s 1st Congressional District
      </h2>
      {props.searchResults.breadth.naics === `31---` && (
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-500">
          Industry: Manufacturing
        </h2>
      )}
      <Separator className="mt-4 mb-4" />
      <div className="text-center">
        <h2 className="text-8xl font-bold text-tero-100">
          {(props.dashboardData.q2Totals[0].total_emp || 0).toLocaleString(
            "en-US"
          )}
        </h2>
        <h2 className="text-xl font-semibold text-tero-100 mt-1">Employees</h2>
      </div>
      <div className="text-center">
        <h2 className="text-8xl font-bold">
          {(props.dashboardData.q2Totals[0].total_est || 0).toLocaleString(
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
