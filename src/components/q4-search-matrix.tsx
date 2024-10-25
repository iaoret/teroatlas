import { Blocks } from "lucide-react";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";
import { Q4SearchResults } from "@/interfaces";

export default function Q4SearchMatrix(props: {
  buildDashboard: () => void;
  searchString: string;
  searchResults: Q4SearchResults;
  setSearchResults: Dispatch<SetStateAction<Q4SearchResults>>;
}) {
  function handleClickOnIntensity(variable: string, order: string) {
    const currentVariable = props.searchResults.intensity.variable;
    const currentOrder = props.searchResults.intensity.order;

    if (currentVariable === variable && currentOrder === order) {
      console.log("same");
      return;
    } else {
      props.setSearchResults({
        ...props.searchResults,
        intensity: {
          ...props.searchResults.intensity,
          variable: variable,
          order: order,
        },
      });
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className={"w-full min-w-[100%] h-[500px]"}>
        <div id="1st-row" className="w-full h-[calc(100%/5)] flex flex-row">
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
            nyc
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
            {" "}
            New York City
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
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] ">
            2023
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
            lowest gross income per full market value
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
            Estimated gross income as percentual of full market value
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs">
            <ul>
              {[
                {
                  title: "Highest Value",
                  variable: "perc",
                  order: "desc",
                },
                {
                  title: "Lowest Value",
                  variable: "perc",
                  order: "asc",
                },
              ].map((item) => {
                return (
                  <li
                    key={item.title}
                    className={`font-semibold hover:font-bold hover:cursor-pointer ${
                      props.searchResults.intensity.variable ===
                        item.variable &&
                      props.searchResults.intensity.order === item.order &&
                      "text-tero-100"
                    }`}
                    onClick={() =>
                      handleClickOnIntensity(item.variable, item.order)
                    }
                  >
                    <span className="font-semibold">{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center  border-gray-500 border-[1px] text-xs hover:cursor-pointer text-tero-100 font-bold"></div>
        </div>
        <div id="5th-row" className="h-[calc(100%/5)] flex flex-row">
          <div className="w-[calc(100%/7)] h-full flex items-center justify-center text-center border-gray-500 border-[1px] rounded-bl-md">
            Unit
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
            borough block
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center rounded-br-md border-gray-500 border-[1px] text-xs hover:cursor-pointer">
            <ul>
              <li className="font-semibold text-tero-100">Boro-Block</li>
              <li>Boro-Block-Lot (aggregated)</li>
            </ul>
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
