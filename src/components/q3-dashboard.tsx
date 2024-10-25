import { Q3SearchResults, Q3DashboardData } from "@/interfaces";
import { Separator } from "./ui/separator";

export default function Q3Dashboard(props: {
  dashboardData: Q3DashboardData;
  searchResults: Q3SearchResults;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-center mt-4 mb-4">
        {props.searchResults.place!} of District of Columbia
      </h2>

      <Separator className="mt-4 mb-4" />
      <div className="text-center">
        <h2 className="text-8xl font-bold ">
          {(props.dashboardData.q3Totals[0].total_emp || 0).toLocaleString(
            "en-US"
          )}
        </h2>
        <h2 className="text-xl font-semibold  mt-1">Employees</h2>
      </div>
      <div className="text-center">
        <h2 className="text-8xl font-bold">
          {(props.dashboardData.q3Totals[0].total_housing || 0).toLocaleString(
            "en-US"
          )}
        </h2>
        <h2 className="text-xl font-semibold mt-1">Houses</h2>
      </div>
      <div className="text-center text-tero-100">
        <h2 className="text-8xl font-bold">
          {(props.dashboardData.q3Totals[0].total_ratio || 0).toLocaleString(
            "en-US"
          )}
        </h2>
        <h2 className="text-xl font-semibold mt-1">Employees per House Unit</h2>
      </div>
      <h2 className="text-xs italic text-slate-600 text-center mt-4">
        Calculated using data from {props.dashboardData.q3Totals[0].count_zip}{" "}
        ZIP Codes within target geography in the year of 2022
      </h2>
    </div>
  );
}
