import environments from "@/environments";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function ShopByLocal(props: { searchKey: string }) {
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [searchLocal, setSearchLocal] = useState<{
    isOpen: boolean;
    search: string;
    searchResults:
      | {
          place: string;
          type: string;
          key: string;
        }[]
      | undefined;
  }>({
    isOpen: false,
    search: "",
    searchResults: undefined,
  });
  const [isOpen, setIsOpen] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputSearchByLocalRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleMakeSearchByLocal(mapKey: string, featureId?: string) {
    setIsOpen(false);
    navigate(
      `/dashboard/retail-map?mapKey=${mapKey}${
        featureId ? `&featureId=` + featureId : ""
      }&searchKey=${props.searchKey}`
    );
  }

  const handleSearchByLocal = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchLocal((prev) => ({
        ...prev,
        search: e.target.value,
      }));
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(async () => {
        const search = e.target.value;

        if (!search) {
          setSearchLocal((prev) => ({
            ...prev,
            searchResults: undefined,
          }));
        }

        setLoadingLocal(true);

        const congressionalDistricts = await fetch(
          `${environments.urlRest}/q1_dc_congressional_district?namelsad20=ilike.*${search}*&order=namelsad20.asc`
        ).then((res) => res.json());

        const wards = await fetch(
          `${environments.urlRest}/q3_dc_wards?NAME=ilike.*${search}*&order=NAME.asc`
        ).then((res) => res.json());

        const zipCodes = await fetch(
          `${environments.urlRest}/q1_dc_zip_codes?ZIP_CODE_TEXT=ilike.*${search}*&order=ZIP_CODE_TEXT.asc`
        ).then((res) => res.json());

        const results = [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...congressionalDistricts.map((e: any) => {
            return {
              place: e.namelsad20,
              type: "Congressional District",
              key: `q1_dc_congressional_district&featureId=${e.id}`,
            };
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...wards.map((e: any) => {
            return {
              place: e["NAME"],
              type: "Ward of DC",
              key: `q3_dc_wards&featureId=${e.id}`,
            };
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...zipCodes.map((e: any) => {
            return {
              place: e["ZIP_CODE_TEXT"],
              type: "ZIP Codes",
              key: `q1_dc_zip_codes&featureId=${e.id}`,
            };
          }),
        ];

        setSearchLocal((prev) => ({
          ...prev,
          searchResults: results.length > 0 ? results : undefined,
        }));
        setLoadingLocal(false);
      }, 200);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchLocal]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === `Esc` &&
        inputSearchByLocalRef.current === document.activeElement
      ) {
        setSearchLocal((prev) => ({ ...prev, isOpen: false, search: "" }));
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [searchLocal]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTitle className="sr-only">
        Search by city, ward or ZIP Code
      </DialogTitle>
      <DialogTrigger className="bg-transparent p-0  outline-none hover:outline-none hover:border-none active:border-none">
        <Button className="w-auto">Shop My Local</Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] md:w-1/2 lg:w-1/3 overflow-y-auto">
        <DialogHeader>
          <DialogDescription>
            <Input
              ref={inputSearchByLocalRef}
              placeholder="Search by city, ward or ZIP Code"
              value={searchLocal.search}
              onChange={handleSearchByLocal}
              autoFocus
            ></Input>
          </DialogDescription>
          <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
            {loadingLocal &&
              [1, 2, 3].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="w-full h-[80px]" />
                </div>
              ))}
            {!loadingLocal &&
              searchLocal.searchResults &&
              searchLocal.searchResults.map((e, i) => (
                <div
                  key={i}
                  onClick={() => handleMakeSearchByLocal(e.key)}
                  className="flex flex-row justify-between rounded-md border-[1px] border-gray-700 p-4 hover:cursor-pointer hover:bg-gray-700 items-center"
                >
                  <div className="flex flex-col">
                    <p className="font-semibold">{e.place}</p>
                    <p className="text-gray-600">{e.type}</p>
                  </div>
                  <ChevronRight />
                </div>
              ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
