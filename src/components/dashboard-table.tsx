import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DashboardTable(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any }[];
  tableInfo: string;
}) {
  const data = props.data.slice(0, 10);

  const lastVariableTotal = props.data
    .map((e) => e[Object.keys(e)[Object.keys(e).length - 1]])
    .reduce((acc, curr) => acc + curr, 0);

  function getTextAlignment(index: number, length: number) {
    if (index === length - 1) return "text-right";
    if (index === 0) return "text-left";
    return "text-center";
  }
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl font-bold">Data Table Preview</h2>

      <p className="text-xs italic text-slate-600">{props.tableInfo}</p>
      <Table>
        <TableCaption>
          Showing {data.length} entries of a total of {props.data.length}.
          {data.length < props.data.length &&
            ` Export the data to see more results.`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            {Object.keys(data[0]).map((key, i, arr) => {
              return (
                <TableHead key={i} className={getTextAlignment(i, arr.length)}>
                  {key}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((e, i) => (
            <TableRow key={i}>
              {Object.keys(e).map((key, i, arr) => {
                return (
                  <TableCell
                    key={i}
                    className={getTextAlignment(i, arr.length)}
                  >
                    {JSON.stringify(e[key])}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {data.length < props.data.length && (
            <TableRow>
              {Object.keys(data[0]).map((_, i, arr) => {
                return (
                  <TableCell
                    key={i}
                    className={getTextAlignment(i, arr.length)}
                  >
                    ...
                  </TableCell>
                );
              })}
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow className="font-bold">
            <TableCell colSpan={Object.keys(data[0]).length - 1}>
              Total
            </TableCell>
            <TableCell className="text-right">{lastVariableTotal}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
