import { Q4SearchResults, Q4DashboardData } from "@/interfaces";
import { Separator } from "./ui/separator";

export default function Q4Dashboard(props: {
  dashboardData: Q4DashboardData;
  searchResults: Q4SearchResults;
}) {
  const grossIncome =
    props.dashboardData.q4Data[0].avg_estimated_gross_income || 0;
  const marketValue = props.dashboardData.q4Data[0].avg_full_market_value || 0;
  const perc =
    props.dashboardData.q4Data[0].perc_gross_income_as_full_market_value;
  const numberObs = props.dashboardData.q4Data[0].number_of_obs;

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-center mt-4">
        New York City - {props.dashboardData.q4Data[0].borough},{" "}
        {props.dashboardData.q4Data[0].block}
      </h2>
      <h2 className="text-xl font-semibold text-center mb-4 text-gray-500">
        Lowest gross income block per full market value
      </h2>

      <Separator className="mt-4 mb-4" />
      <div className="text-center">
        <h2 className="text-8xl font-bold text-tero-100">
          {grossIncome > 1000000
            ? `${(grossIncome / 1000000).toLocaleString("en-US")}mi`
            : grossIncome.toLocaleString("en-US")}
        </h2>
        <h2 className="text-xl font-semibold  mt-1">
          Average Estimated Gross Income
        </h2>
      </div>
      <div className="text-center">
        <h2 className="text-8xl font-bold">
          {marketValue > 1000000
            ? `${(marketValue / 1000000).toLocaleString("en-US")}mi`
            : marketValue.toLocaleString("en-US")}
        </h2>
        <h2 className="text-xl font-semibold mt-1">
          Average Full Market Value
        </h2>
      </div>
      <div className="text-center text-tero-100">
        <h2 className="text-8xl font-bold">
          {(Math.floor(perc * 10000) / 100).toLocaleString("en-US")}%
        </h2>
        <h2 className="text-xl font-semibold mt-1">
          Estimated Gross Income as percentual of Full Market Value
        </h2>
      </div>
      <h2 className="text-xs italic text-slate-600 text-center mt-4">
        Calculated using data from {numberObs} {numberObs > 1 ? "lots" : "lot"}{" "}
        in the block, for the years of{" "}
        {props.searchResults.time.years.join(", ")}
      </h2>
    </div>
  );
}
