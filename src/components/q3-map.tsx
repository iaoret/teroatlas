import { FeatureLike } from "ol/Feature";
import { MVT } from "ol/format";
import { Style, Stroke, Fill } from "ol/style";
import { useCallback } from "react";
import { RLayerVectorTile } from "rlayers";
import environment from "@/environments";
import { Q3SearchResults, Q3DashboardData } from "@/interfaces";
import getChoroplethColor from "@/lib/getChoroplethColor";

export default function Q3Map(props: {
  dashboardData: Q3DashboardData | undefined;
  searchResults: Q3SearchResults;
}) {
  const styleSelectedLayer = useCallback(
    (feature: FeatureLike) => {
      const identifier = feature.get("ward_name");

      if (identifier !== props.searchResults.place) return;

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
    [props]
  );

  return (
    <>
      {
        <RLayerVectorTile
          url={`${environment.urlTiles}/public.q3_tile_function/{z}/{x}/{y}.pbf?ward_identifier=${props.searchResults.place}`}
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
                    props.dashboardData?.choroplethicData["maxRatio"],
                    props.dashboardData?.choroplethicData["minRatio"],
                    [255, 255, 255],
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
        url={`${environment.urlTiles}/public.q3_dc_wards_housing/{z}/{x}/{y}.pbf`}
        format={new MVT()}
      />
    </>
  );
}
