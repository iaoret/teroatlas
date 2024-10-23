import { FeatureLike } from "ol/Feature";
import { MVT } from "ol/format";
import { Style, Stroke, Fill } from "ol/style";
import { useCallback } from "react";
import { RLayerVectorTile } from "rlayers";
import environment from "@/environments";
import { Q2SearchResults, Q2DashboardData } from "@/interfaces";
import getChoroplethColor from "@/lib/getChoroplethColor";

export default function Q2Map(props: {
  dashboardData: Q2DashboardData | undefined;
  searchResults: Q2SearchResults;
}) {
  const styleSelectedLayer = useCallback(
    (feature: FeatureLike) => {
      const id = feature.get("District");

      if (id !== 1) return;

      return new Style({
        stroke: new Stroke({
          color: props.dashboardData ? "#ff0000" : "#00000000",
          width: 5,
        }),
        fill: new Fill({
          color: "#00000000",
        }),
      });
    },
    [props.dashboardData]
  );

  return (
    <>
      {
        <RLayerVectorTile
          url={`${environment.urlTiles}/public.q2_tile_function/{z}/{x}/{y}.pbf?district_id=1&naics_code=${props.searchResults.breadth.naics}`}
          format={new MVT()}
          style={useCallback(
            (feature: FeatureLike) => {
              if (!props.dashboardData) return;
              const value = feature.get(props.searchResults.intensity.variable);
              console.log(
                "variable",
                props.searchResults.intensity.variable,
                "value",
                value,
                "min",
                props.dashboardData?.choroplethicData[
                  props.searchResults.intensity.variable === "aprox_emp"
                    ? "minEmp"
                    : "minEst"
                ],
                "max",
                props.dashboardData?.choroplethicData[
                  props.searchResults.intensity.variable === "aprox_emp"
                    ? "maxEmp"
                    : "maxEst"
                ]
              );
              return new Style({
                stroke: new Stroke({
                  color: "#00447C",
                  width: 1,
                }),
                fill: new Fill({
                  color: getChoroplethColor(
                    value,
                    props.dashboardData?.choroplethicData[
                      props.searchResults.intensity.variable === "aprox_emp"
                        ? "maxEmp"
                        : "maxEst"
                    ],
                    props.dashboardData?.choroplethicData[
                      props.searchResults.intensity.variable === "emp"
                        ? "minEmp"
                        : "minEst"
                    ],
                    [0, 0, 0],
                    [12, 63, 150],
                    0.8
                  ),
                }),
              });
            },
            [props.dashboardData, props.searchResults]
          )}
          // onPointerMove={(e) => {
          //   console.log(e.target.getProperties());
          // }}
          onClick={(e) => {
            console.log(e.target.getProperties());
          }}
        />
      }
      <RLayerVectorTile
        // TODO: this logic here can be used for the MVP, need to make the selectedGeometry more dynamic
        style={styleSelectedLayer}
        url={`${environment.urlTiles}/public.q2_nys_congressional_districts_multi/{z}/{x}/{y}.pbf`}
        format={new MVT()}
      />
    </>
  );
}
