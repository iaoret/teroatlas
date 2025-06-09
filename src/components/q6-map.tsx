import getChoroplethColor from "@/lib/getChoroplethColor";
import Feature, { FeatureLike } from "ol/Feature";
import { GeoJSON } from "ol/format";
import { Style, Stroke, Fill } from "ol/style";
import { useCallback, useEffect, useMemo } from "react";
import { RFeature, RLayerVector, RMap } from "rlayers";
import { Q6SearchResults, Q6DashboardData } from "@/interfaces";
import { Polygon } from "ol/geom";
import WKT from "ol/format/WKT";

export default function Q6Map(props: {
  dashboardData: Q6DashboardData | undefined;
  searchResults: Q6SearchResults;
  mapRef: React.RefObject<RMap>;
}) {
  const zipCodesFeatures = useMemo(() => {
    if (!props.dashboardData?.mapInfo.zipCodes) return undefined;
    return new GeoJSON({
      featureProjection: "EPSG:3857",
      featureClass: Feature,
    }).readFeatures(props.dashboardData.mapInfo.zipCodes) as Feature<Polygon>[];
  }, [props.dashboardData]);

  const congressionalDistrictsFeatures = useMemo(() => {
    if (!props.dashboardData?.mapInfo.congressionalDistricts) return undefined;
    return new GeoJSON({
      featureProjection: "EPSG:3857",
      featureClass: Feature,
    }).readFeatures(
      props.dashboardData.mapInfo.congressionalDistricts
    ) as Feature<Polygon>[];
  }, [props.dashboardData]);

  console.log(
    "For that query we have",
    zipCodesFeatures?.length,
    congressionalDistrictsFeatures?.length
  );

  useEffect(() => {
    if (!props.dashboardData) return;

    if (props.mapRef.current && props.dashboardData.q6BoundingBox) {
      try {
        // Parse the WKT bounding box
        const wktFormat = new WKT();
        const geometry = wktFormat.readGeometry(
          props.dashboardData.q6BoundingBox,
          {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          }
        );

        // Get the extent of the geometry
        const extent = geometry.getExtent();

        // Fit the map view to the extent with some padding
        props.mapRef.current.ol.getView().fit(extent, {
          padding: [50, 50, 50, 50], // Add some padding around the extent
          duration: 1000, // Animate the transition over 1 second
        });
      } catch (error) {
        console.error("Error parsing WKT bounding box:", error);
      }
    }
  }, [props.dashboardData, props.mapRef]);

  const zipCodeStyle = useCallback(
    (feature: FeatureLike) => {
      if (!props.dashboardData) return;
      const properties = feature.getProperties();

      return new Style({
        stroke: new Stroke({
          color: "#00447C",
          width: 1,
        }),
        fill: new Fill({
          color: getChoroplethColor(
            properties[props.searchResults.intensity.variable],
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
            0.7
          ),
        }),
      });
    },
    [props.dashboardData, props.searchResults.intensity.variable]
  );

  if (!zipCodesFeatures || !congressionalDistrictsFeatures) return null;

  return (
    <>
      <RLayerVector>
        {zipCodesFeatures.map((feature) => (
          <RFeature
            feature={feature}
            style={zipCodeStyle}
            key={`zip-${feature.getProperties()["zip"] || "default"}`}
          />
        ))}
      </RLayerVector>
      <RLayerVector>
        {congressionalDistrictsFeatures.map((feature, i) => (
          <RFeature
            feature={feature}
            style={
              new Style({
                stroke: new Stroke({
                  color: "#ff0000",
                  width: 3,
                }),
              })
            }
            key={`cd-${i}`}
          />
        ))}
      </RLayerVector>
    </>
  );
}
