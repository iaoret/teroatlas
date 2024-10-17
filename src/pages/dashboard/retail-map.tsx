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

export default function RetailMap() {
  const mapRef = useRef<RMap>(null);
  const layerRef = useRef<RLayerVectorTile>(null);
  const [highlightedFeature, setHighlightedFeature] =
    useState<FeatureLike | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null); // Novo estado para controlar o ID do recurso destacado
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function handleGoBack() {
    navigate(-1);
  }

  const getMapKey = useCallback(() => {
    if (searchParams.get("key")) {
      return searchParams.get("key");
    } else {
      navigate("/dashboard/retail-home");
      return "";
    }
  }, [navigate, searchParams]);

  const getFeatureId = useCallback(() => {
    if (searchParams.get("id")) {
      return Number(searchParams.get("id"));
    } else {
      return null;
    }
  }, [searchParams]);

  // Atualizar o zoom uma única vez quando o highlightedFeature mudar
  useEffect(() => {
    if (highlightedFeature && mapRef.current) {
      const extent = highlightedFeature.getGeometry()?.getExtent();
      if (extent) {
        console.log(`Im zooming on ${extent}`);
        mapRef.current.ol.getView().fit(extent as Extent, {
          size: mapRef.current.ol.getSize(),
          duration: 1000,
          padding: [50, 50, 50, 50],
          maxZoom: 16,
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
        console.log("Highlighting feature with ID: " + value);
        setHighlightedFeature(feature);
        setHighlightedId(value); // Evita setar o mesmo recurso múltiplas vezes
      }
    },
    [highlightedId, getFeatureId]
  );

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
          <RControl.RCustom className="top-[15px] left-[15px] bg-slate-50 rounded-md text-slate-900 z-[1000]">
            <Button
              className="p-2 w-[36px] h-[36px] flex justify-center"
              onClick={handleGoBack}
            >
              <ArrowBack className="h-4 w-4" />
            </Button>
          </RControl.RCustom>
          <RControl.RCustom className="top-[15px] left-[50%] translate-x-[-50%] w-1/2 max-w-[80%] h-[36px] bg-slate-50 rounded-md text-slate-900 z-[1000] shadow-sm shadow-gray ">
            {/* <Dialog
              open={isSearching}
              onOpenChange={() => setIsSearching(!isSearching)}
            >
              <DialogTitle className="sr-only">Search by anything</DialogTitle>
              <DialogTrigger className="w-full h-full flex flex-row items-center justify-between rounded-md pl-2  max-w-full max-h-full text-ellipsis overflow-hidden word">
                <div className="flex flex-row w-full h-full items-center gap-2">
                  <Search className="h-4 w-4 " />
                  {search === "" ? (
                    <p className="font-light text-left italic text-slate-600">
                      Search by anything (Ctrl + F or K)
                    </p>
                  ) : (
                    <p className="font-light text-left italic text-slate-600 leading-tight">
                      Searching by "{search}"{" "}
                    </p>
                  )}
                </div>
                {search !== "" && (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-transparent hover:text-slate-600 hover:border-transparent"
                    onClick={(e) => clearSearch(e)}
                  >
                    <Cross2Icon className="h-4 w-4" />
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogDescription>
                    <Input
                      placeholder="Search by anything"
                      value={search}
                      onInput={handleSearch}
                      autoFocus
                    ></Input>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center min-w-[50vw]">
                  <SearchMatrix
                    loading={loading}
                    search={search}
                    buildDashboard={buildDashboard}
                    setSearchResults={setSearchResults}
                    searchResults={searchResults}
                  />
                </div>
              </DialogContent>
            </Dialog> */}
          </RControl.RCustom>
          <RControl.RCustom className="right-0 w-4 bg-primary-foreground h-full rounded-r-none rounded-l-lg shadow-lg shadow-black flex justify-center items-center" />
        </RMap>
      </div>
      <div
        className={`${"w-[50vw] min-w-[50vw]"} transition-all duration-200 flex flex-col justify-center z-20  bg-primary-foreground`}
      ></div>
    </div>
  );
}
