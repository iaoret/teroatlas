import { Blocks } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Q2SearchResults } from "@/interfaces";
import { Input } from "./ui/input";

export default function Q2SearchMatrix(props: {
  buildDashboard: () => void;
  searchResults: Q2SearchResults;
  setSearchResults: Dispatch<SetStateAction<Q2SearchResults>>;
}) {
  const [isEditingNaicsCode, setIsEditingNaicsCode] = useState(false);

  const inputNaicsCodeRef = useRef(null);

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

  function handleClickOnBreadth() {
    if (!isEditingNaicsCode) setIsEditingNaicsCode(true);
  }

  function handleChangeNaicsCode(e: FormEvent<HTMLInputElement>) {
    props.setSearchResults((prev) => ({
      ...prev,
      breadth: {
        ...prev.breadth,
        naics: e.currentTarget.value,
      },
    }));
  }

  useEffect(() => {
    const click = () => {
      if (
        inputNaicsCodeRef.current &&
        inputNaicsCodeRef.current !== document.activeElement &&
        isEditingNaicsCode
      ) {
        setIsEditingNaicsCode(false);
      }
    };
    document.addEventListener("click", click);

    const down = (e: KeyboardEvent) => {
      if (e.key === `Enter` && isEditingNaicsCode) {
        setIsEditingNaicsCode(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("click", click);
    };
  }, [isEditingNaicsCode]);

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
          <div className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center border-gray-500 border-[1px] text-xs">
            <ul>
              {[
                {
                  title: "Highest Value (Est.)",
                  variable: "est",
                  order: "desc",
                },
                {
                  title: "Highest Value (Emp.)",
                  variable: "aprox_emp",
                  order: "desc",
                },
                {
                  title: "Lowest Value (Est.)",
                  variable: "est",
                  order: "asc",
                },
                {
                  title: "Lowest Value (Emp.)",
                  variable: "aprox_emp",
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
          <div
            className="w-[calc(100%/7)] h-full hover:bg-slate-800 flex items-center justify-center text-center  border-gray-500 border-[1px] text-xs hover:cursor-pointer text-tero-100 font-bold"
            onClick={handleClickOnBreadth}
          >
            {!isEditingNaicsCode &&
              `NAICS: ${props.searchResults.breadth.naics}`}

            {isEditingNaicsCode && (
              <Input
                ref={inputNaicsCodeRef}
                autoFocus
                value={props.searchResults.breadth.naics}
                onChange={handleChangeNaicsCode}
                className="h-full w-full text-center bg-tero-600 text-white"
              />
            )}
          </div>
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
