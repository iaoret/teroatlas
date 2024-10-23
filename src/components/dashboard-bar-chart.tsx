import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardBarChart(props: {
  chartInfo: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any }[];
  dataKeyXAxis: string;
  dataKeyBar: string;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold">Top 10 Observations by Sub-Unit</h2>

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
        <BarChart width={400} height={500} data={props.data}>
          <Bar dataKey={props.dataKeyBar} fill={"#4285F4"} />
          <XAxis dataKey={props.dataKeyXAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
        </BarChart>
      </ChartContainer>
    </>
  );
}
