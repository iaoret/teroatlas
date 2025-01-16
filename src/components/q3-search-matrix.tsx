import { Blocks } from "lucide-react";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Q3SearchResults } from "@/interfaces";

export default function Q3SearchMatrix(props: {
  buildDashboard: () => void;
  searchString: string;
  searchResults: Q3SearchResults;
  setSearchResults: Dispatch<SetStateAction<Q3SearchResults>>;
}) {
  function handleClickOnIntensity(variable: string, order: string) {
    const currentVariable = props.searchResults.intensity.variable;
    const currentOrder = props.searchResults.intensity.order;

    if (currentVariable === variable && currentOrder === order) {
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

  useEffect(() => {
    if (props.searchString.toLowerCase().includes("ward 1")) {
      props.setSearchResults((prev) => ({ ...prev, place: `Ward 1` }));
    } else if (props.searchString.toLowerCase().includes("ward 2")) {
      props.setSearchResults((prev) => ({ ...prev, place: `Ward 2` }));
    } else if (props.searchString.toLowerCase().includes("ward 3")) {
      props.setSearchResults((prev) => ({ ...prev, place: `Ward 3` }));
    } else if (props.searchString.toLowerCase().includes("ward 4")) {
      props.setSearchResults((prev) => ({ ...prev, place: `Ward 4` }));
    } else if (props.searchString.toLowerCase().includes("ward 5")) {
      props.setSearchResults((prev) => ({ ...prev, place: `Ward 5` }));
    } else if (props.searchString.toLowerCase().includes("ward 6")) {
      props.setSearchResults((prev) => ({ ...prev, place: `Ward 6` }));
    } else if (props.searchString.toLowerCase().includes("ward 7")) {
      props.setSearchResults((prev) => ({ ...prev, place: `Ward 7` }));
    } else if (props.searchString.toLowerCase().includes("ward 8")) {
      props.setSearchResults((prev) => ({ ...prev, place: `Ward 8` }));
    } else {
      props.setSearchResults((prev) => ({ ...prev, place: null }));
    }
  }, [props]);

  if (!props.searchResults.place) return <></>;

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
            dc
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
            {" "}
            District of Columbia
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
            <ul>
              <li>2022</li>
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
            jobs per housing unit stats
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer">
            <ul>
              <li>
                <span className="font-semibold">Employees</span>
              </li>
              <li>
                <span className="font-semibold">Housing unit</span>
              </li>
            </ul>
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs">
            <ul>
              {[
                {
                  title: "Highest Value (Perc.)",
                  variable: "ratio",
                  order: "desc",
                },
                {
                  title: "Lowest Value (Perc.)",
                  variable: "ratio",
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
            {props.searchResults.place}
          </div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs hover:cursor-pointer"></div>
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center rounded-br-md border-gray-500 border-[1px] text-xs hover:cursor-pointer">
            <ul>
              <li>ZIP Code (Employments)</li>
              <li>Wards (Housing)</li>
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
