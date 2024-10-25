import getChoroplethColor from "@/lib/getChoroplethColor";
import { FeatureLike } from "ol/Feature";
import { MVT } from "ol/format";
import { Style, Stroke, Fill } from "ol/style";
import { useCallback } from "react";
import { RLayerVectorTile } from "rlayers";
import environment from "@/environments";
import { Q1SearchResults, Q1DashboardData } from "@/interfaces";

export default function Q1Map(props: {
  dashboardData: Q1DashboardData | undefined;
  searchResults: Q1SearchResults;
}) {
  return (
    <>
      <RLayerVectorTile
        url={`${
          environment.urlTiles
        }/public.q1_tile_function/{z}/{x}/{y}.pbf?years_set={${props.searchResults.time.years.join(
          ","
        )}}`}
        format={new MVT()}
        style={useCallback(
          (feature: FeatureLike) => {
            if (!props.dashboardData) return;
            const value = feature.get(props.searchResults.intensity.variable);

            return new Style({
              stroke: new Stroke({
                color: "#00447C",
                width: 1,
              }),
              fill: new Fill({
                color: getChoroplethColor(
                  value,
                  props.dashboardData?.choroplethicData[
                    props.searchResults.intensity.variable === "emp"
                      ? "maxEmp"
                      : "maxEst"
                  ],
                  props.dashboardData?.choroplethicData[
                    props.searchResults.intensity.variable === "emp"
                      ? "minEmp"
                      : "minEst"
                  ],
                  [255, 255, 255],
                  [12, 63, 150],
                  0.3
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
      <RLayerVectorTile
        // TODO: this logic here can be used for the MVP, need to make the selectedGeometry more dynamic
        style={useCallback(
          () =>
            new Style({
              stroke: new Stroke({
                color: props.dashboardData ? "#ff0000" : "#00000000",
                width: 5,
              }),
              fill: new Fill({
                color: "#00000000",
              }),
            }),
          [props.dashboardData]
        )}
        url={`${environment.urlTiles}/public.q1_dc_congressional_district/{z}/{x}/{y}.pbf`}
        format={new MVT()}
      />
    </>
  );
}
