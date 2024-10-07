import "ol/ol.css";
import { RMap, ROSM } from "rlayers";
//@ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ROSM'.
import { RView } from "rlayers/RMap";
import { useState } from "react";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";

export default function Dashboard() {
  const [view, setView] = useState<RView>({
    center: [-11087207.298375694, 4659260.145017052],
    zoom: 4.013145380694064,
    resolution: 9695.196372827555,
  });

  return (
    <div className="flex flex-row w-[100vw] min-h-full">
      <div className="w-1/2 h-[100vh] justify-center">
        <RMap
          initial={view}
          view={[view, setView]}
          height={"100%"}
          width={"100%"}
        >
          {" "}
          <ROSM />
        </RMap>
      </div>
      <div className="w-1/2 h-[100vh] justify-center items-center text-center gap-6 p-4">
        <h2 className="text-3xl font-bold">Stats</h2>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            title: {
              text: "World population, total and per region",
            },
            subtitle: {
              text: 'Source: <a href="https://en.wikipedia.org/wiki/List_of_countries_by_population_(United_Nations)">Wikipedia</a>',
            },
            chart: {
              type: "map",
              height: 500,
            },
            mapNavigation: {
              enabled: true,
              buttonOptions: {
                verticalAlign: "bottom",
              },
            },
            colorAxis: {
              min: 0,
              minColor: "#FFFFFF",
              maxColor: "#00447C",
            },
            series: [
              {
                name: "Countries",
                data: [
                  ["USA", 300],
                  ["China", 1400],
                  ["Japan", 1200],
                  ["Germany", 200],
                  ["UK", 100],
                  ["France", 100],
                  ["India", 100],
                  ["Spain", 100],
                  ["Netherlands", 100],
                  ["Russia", 100],
                  ["Canada", 100],
                  ["Brazil", 100],
                  ["Italy", 100],
                  ["Australia", 100],
                  ["Saudi Arabia", 100],
                  ["Iran", 100],
                  ["Pakistan", 100],
                  ["Egypt", 100],
                  ["Bangladesh", 100],
                  ["Poland", 100],
                  ["Lithuania", 100],
                  ["Austria", 100],
                  ["Slovenia", 100],
                  ["Croatia", 100],
                  ["Macedonia", 100],
                  ["Montenegro", 100],
                  ["Serbia", 100],
                  ["Bulgaria", 100],
                  ["Romania", 100],
                  ["Switzerland", 100],
                  ["Czech Republic", 100],
                  ["Slovakia", 100],
                ],
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
