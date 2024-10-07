import "ol/ol.css";
import { RMap, ROSM } from "rlayers";
//@ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ROSM'.
import { RView } from "rlayers/RMap";
import { useState } from "react";

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
      <div className="w-1/2 h-[100vh] justify-center">Charts</div>
    </div>
  );
}
