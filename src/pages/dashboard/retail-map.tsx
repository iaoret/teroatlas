import { FeatureLike } from "ol/Feature";
import { MVT } from "ol/format";
import { useCallback, useEffect, useRef, useState } from "react";
import { RControl, RLayerTile, RLayerVectorTile, RMap } from "rlayers";
import environment from "@/environments";
import { Stroke, Style } from "ol/style";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowBack } from "@/components/icons/arrow-back";
import { Extent } from "ol/extent";
import ShopByLocal from "@/components/shop-my-local";
import environments from "@/environments";
import { Skeleton } from "@/components/ui/skeleton";
import ProductOnResult from "@/components/product-on-result";

export default function RetailMap() {
  const mapRef = useRef<RMap>(null);
  const layerRef = useRef<RLayerVectorTile>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<
    | {
        items: {
          title: string;
          price: number;
          vendor: string;
          image: string;
        }[];
        info: string;
      }
    | undefined
  >(undefined);
  const [highlightedFeature, setHighlightedFeature] =
    useState<FeatureLike | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null); // Novo estado para controlar o ID do recurso destacado
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function handleGoBack() {
    navigate("/dashboard/retail-home");
  }

  const getMapKey = useCallback(() => {
    if (searchParams.get("mapKey")) {
      return searchParams.get("mapKey");
    } else {
      navigate("/dashboard/retail-home");
      return "";
    }
  }, [navigate, searchParams]);

  const getFeatureId = useCallback(() => {
    if (searchParams.get("featureId")) {
      return Number(searchParams.get("featureId"));
    } else {
      return null;
    }
  }, [searchParams]);

  const getSearchKey = useCallback(() => {
    if (searchParams.get("searchKey")) {
      return searchParams.get("searchKey");
    } else {
      return "";
    }
  }, [searchParams]);

  // Atualizar o zoom uma única vez quando o highlightedFeature mudar
  useEffect(() => {
    if (highlightedFeature && mapRef.current) {
      const extent = highlightedFeature.getGeometry()?.getExtent();
      if (extent) {
        mapRef.current.ol.getView().fit(extent as Extent, {
          size: mapRef.current.ol.getSize(),
          duration: 1000,
          maxZoom: 14,
        });
      }
    }
  }, [highlightedFeature]);

  // Verificar quando o recurso destacado deve ser atualizado
  const checkFeatureHighlight = useCallback(
    (feature: FeatureLike) => {
      const value = feature.get("id");
      const targetFeatureId = getFeatureId();

      // Verifique se o ID do feature é o mesmo e evite chamadas repetitivas
      if (value === targetFeatureId && highlightedId !== value) {
        setHighlightedFeature(feature);
        setHighlightedId(value); // Evita setar o mesmo recurso múltiplas vezes
      }
    },
    [highlightedId, getFeatureId]
  );

  useEffect(() => {
    async function fetchProducts() {
      const searchKey = getSearchKey();
      const mapKey = getMapKey();
      const featureId = getFeatureId();

      const response = await fetch(
        `${environments.urlRest}/q5_dc_retail_inventory_mocked?product=ilike.*${searchKey}*&id_${mapKey}=eq.${featureId}&limit=100`,
        {
          headers: {
            Prefer: "count=exact",
          },
        }
      );

      const newProducts: {
        id: number;
        product: string;
        retailer: string;
        price: number;
        zip_code: number;
        id_q1_dc_zip_codes: number;
        id_q3_dc_wards: number;
        id_q1_dc_congressional_district: number;
      }[] = await response.json();

      const range = await response.headers.get("Content-Range");

      setLoading(false);
      setProducts({
        info:
          newProducts.length === 0
            ? `No products match your criteria`
            : `Showing ${newProducts.length} results out of ${
                range?.split("/")[1]
              } products matching "${searchKey}" on the highlighted area`,
        items: newProducts.map((e) => {
          return {
            title: e.product,
            price: e.price,
            vendor: e.retailer,
            image: `https://placehold.co/80x70?text=${e.product} (${e.id})`,
          };
        }),
      });
    }

    fetchProducts();
  }, [getFeatureId, getMapKey, getSearchKey]);

  const searchKey = getSearchKey();

  return (
    <div className="flex flex-row w-[100vw] min-h-full">
      <div className="w-full h-[100vh] justify-center z-10">
        <RMap
          ref={mapRef}
          initial={{
            center: [-8571898.852188004, 4711593.563212575],
            zoom: 11,
            resolution: 9695.196372827555,
          }}
          height={"100%"}
          width={"100%"}
          noDefaultControls
        >
          <RLayerTile url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <RLayerVectorTile
            ref={layerRef}
            url={`${
              environment.urlTiles
            }/public.${getMapKey()}/{z}/{x}/{y}.pbf`}
            format={new MVT()}
            style={useCallback(
              (feature: FeatureLike) => {
                // Verifique o destaque fora do render para evitar múltiplas atualizações de estado
                checkFeatureHighlight(feature);

                const value = feature.get("id");
                if (value === getFeatureId()) {
                  return new Style({
                    zIndex: 1000,
                    stroke: new Stroke({
                      color: "#ff0000",
                      width: 6,
                    }),
                  });
                } else {
                  return new Style({
                    zIndex: 900,
                    stroke: new Stroke({
                      color: "#ffffff",
                      width: 2,
                    }),
                  });
                }
              },
              [getFeatureId, checkFeatureHighlight]
            )}
          />
          <RControl.RCustom
            className={`top-[15px] left-[15px] min-w-full flex flex-row bg-transparent gap-[15px]`}
          >
            <Button
              className="p-2 w-[36px] h-[36px] flex justify-center"
              onClick={handleGoBack}
            >
              <ArrowBack className="h-4 w-4" />
            </Button>
          </RControl.RCustom>
          <RControl.RCustom className="right-0 w-4 bg-primary-foreground h-full rounded-r-none rounded-l-lg shadow-lg shadow-black flex justify-center items-center" />
        </RMap>
      </div>
      <div
        className={`${"w-[50vw] min-w-[50vw]"} transition-all duration-200 flex flex-col justify-start pt-[15px] z-20  bg-primary-foreground max-h-screen gap-2`}
      >
        {searchKey && <ShopByLocal searchKey={searchKey} />}
        {products && (
          <p className="text-sm italic text-gray-500 text-center">
            {products.info}
          </p>
        )}
        <div className="flex flex-row gap-2 flex-wrap items-center justify-center p-6 h-full w-full max-h-full overflow-y-auto">
          {loading &&
            Array.from({ length: 15 }).map((_, i) => (
              <Skeleton key={i} className="w-[150px] h-[150px] m-8" />
            ))}
          {!loading &&
            products &&
            products.items &&
            products.items.map((result, i) => (
              <ProductOnResult
                key={i}
                title={result.title}
                vendor={result.vendor}
                image={result.image}
                price={result.price}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
