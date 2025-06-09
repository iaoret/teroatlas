import { Q6SearchResults, Q6DashboardData } from "@/interfaces";
import { Separator } from "./ui/separator";

export default function Q6Dashboard(props: {
  dashboardData: Q6DashboardData;
  searchResults: Q6SearchResults;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-center mt-4 mb-4">
        {props.dashboardData.chartInfo.title}
      </h2>

      <Separator className="mt-4 mb-4" />
      <div className="text-center">
        <h2 className="text-8xl font-bold text-tero-100">
          {(props.dashboardData.q6Totals.total_emp || 0).toLocaleString(
            "en-US"
          )}
        </h2>
        <h2 className="text-xl font-semibold text-tero-100 mt-1">Employees</h2>
      </div>
      <div className="text-center">
        <h2 className="text-8xl font-bold">
          {(props.dashboardData.q6Totals.total_est || 0).toLocaleString(
            "en-US"
          )}
        </h2>
        <h2 className="text-xl font-semibold mt-1">Establishments</h2>
      </div>
      <h2 className="text-xs italic text-slate-600 text-center mt-4">
        {props.dashboardData.chartInfo.info}
      </h2>
    </div>
  );
}
