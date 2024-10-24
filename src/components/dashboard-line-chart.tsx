import { ChartContainer } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardLineChart(props: {
  chartInfo: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any }[];
  dataKeyXAxis: string;
  dataKeyYAxis: string;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold">Value Over Time</h2>

      <p className="text-xs italic text-slate-600">{props.chartInfo}</p>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "#2563eb",
          },
          mobile: {
            label: "Mobile",
            color: "#60a5fa",
          },
        }}
        className="h-full w-full mt-4 mb-4"
      >
        <LineChart width={400} height={500} data={props.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={props.dataKeyXAxis} />
          <YAxis />
          <Line type="monotone" dataKey={props.dataKeyYAxis} stroke="#4285F4" />
          <Tooltip />
        </LineChart>
      </ChartContainer>
    </>
  );
}
