import { Blocks } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

export default function SearchMatrix(props: {
  loading: boolean;
  search: string;
  buildDashboard: () => void;
}) {
  if (props.loading) return <Skeleton className="w-[800px] h-[500px]" />;

  if (
    props.search.includes("dc") &&
    props.search.includes("congressional district") &&
    props.search.includes("economic data")
  ) {
    return (
      <div className="flex flex-col items-center">
        <div className={"w-[850px] h-[500px]"}>
          <div id="1st-row" className="h-[calc(100%/5)] flex flex-row">
            <div className="w-[calc(100%/7)] h-full bg-transparent"></div>
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center rounded-tl-md border-gray-500 border-[1px]">
              {" "}
              Filters & Results
            </div>
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center border-gray-500 border-[1px]">
              {" "}
              Search Results
            </div>
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center border-gray-500 border-[1px]">
              Length of Observations
            </div>
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center border-gray-500 border-[1px]">
              Time of Observations
            </div>
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center border-gray-500 border-[1px]">
              Intensity of Observations
            </div>
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center rounded-tr-md border-gray-500 border-[1px]">
              Breadth of Observations
            </div>
          </div>
          <div id="2nd-row" className="h-[calc(100%/5)] flex flex-row">
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center rounded-tl-md border-gray-500 border-[1px]">
              Place
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              {" "}
              dc
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              {" "}
              DC (Congressional District)
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              Min # Observations
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center  border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          </div>
          <div id="3rd-row" className="h-[calc(100%/5)] flex flex-row">
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center  border-gray-500 border-[1px]">
              Period
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              <ul>
                <li>
                  <span className="font-semibold">2019</span>
                </li>
                <li>
                  <span className="font-semibold">2020</span>
                </li>
                <li>
                  <span className="font-semibold">2021</span>
                </li>
                <li>
                  <span className="font-semibold">2022</span>
                </li>
              </ul>
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center  border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          </div>
          <div id="4th-row" className="h-[calc(100%/5)] flex flex-row">
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center border-gray-500 border-[1px]">
              Topic
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              economic data
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              <ul>
                <li>
                  <span className="font-semibold">Employees</span>
                </li>
                <li>
                  <span className="font-semibold">Establishments</span>
                </li>
              </ul>
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              <ul>
                <li>
                  <span className="font-semibold">Highest Value (Est.)</span>
                </li>
                <li>
                  <span className="font-semibold">Highest Value (Emp.)</span>
                </li>
                <li>
                  <span className="font-semibold">Lowest Value (Est.)</span>
                </li>
                <li>
                  <span className="font-semibold">Lowest Value (Emp.)</span>
                </li>
              </ul>
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center  border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          </div>
          <div id="5th-row" className="h-[calc(100%/5)] flex flex-row">
            <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center border-gray-500 border-[1px] rounded-bl-md">
              Unit
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              congressional district
            </div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
            <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center rounded-br-md border-gray-500 border-[1px] text-xs hover:cursor-pointer">
              {" "}
              ZIP Code (converted)
            </div>
          </div>
        </div>
        <Button
          className="bg-tero-100 text-white hover:bg-tero-400 mt-4"
          onClick={props.buildDashboard}
        >
          <Blocks /> &nbsp; Build Dashboard
        </Button>
      </div>
    );
  }

  if (props.search !== "") return <>No results found</>;

  return <></>;
}
