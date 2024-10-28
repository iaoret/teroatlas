import { FeatureLike } from "ol/Feature";
import { MVT } from "ol/format";
import { Style, Stroke, Fill } from "ol/style";
import { useCallback } from "react";
import { RLayerVectorTile } from "rlayers";
import environment from "@/environments";
import { Q4SearchResults, Q4DashboardData } from "@/interfaces";
import getChoroplethColor from "@/lib/getChoroplethColor";

export default function Q4Map(props: {
  dashboardData: Q4DashboardData | undefined;
  searchResults: Q4SearchResults;
}) {
  return (
    <>
      {
        <RLayerVectorTile
          url={`${environment.urlTiles}/public.q4_nyc_boro_block_economic_data_tb/{z}/{x}/{y}.pbf`}
          format={
            new MVT({
              geometryName: "geom",
            })
          }
          style={useCallback(
            (feature: FeatureLike) => {
              const value = feature.get(
                `perc_gross_income_as_full_market_value`
              );
              const uid = feature.get("uid");
              return new Style({
                stroke: new Stroke({
                  color:
                    uid === props.dashboardData?.q4Data[0].uid
                      ? "#ff0000"
                      : "#00447C",
                  width: uid === props.dashboardData?.q4Data[0].uid ? 3 : 1,
                }),
                fill: new Fill({
                  color: value
                    ? getChoroplethColor(
                        value,
                        props.dashboardData?.choroplethicData["maxPerc"] || 1,
                        props.dashboardData?.choroplethicData["minPerc"] || 0,
                        [12, 63, 150],
                        [255, 255, 255],
                        0.8
                      )
                    : "#00000000",
                }),
              });
            },
            [props.dashboardData]
          )}
          onClick={(e) => {
            console.log(e.target.getProperties());
          }}
        />
      }
    </>
  );
}
