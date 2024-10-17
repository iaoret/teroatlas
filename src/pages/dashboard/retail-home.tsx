import { ArrowBack } from "@/components/icons/arrow-back";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Cross2Icon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchByLocal from "@/components/shop-my-local";

export default function RetailHome() {
  const [search, setSearch] = useState<{
    search: string;
    searchResults:
      | {
          title: string;
          price: number;
          image: string;
        }[]
      | undefined;
  }>({
    search: "",
    searchResults: undefined,
  });
  // const [searchLocal, setSearchLocal] = useState<{
  //   isOpen: boolean;
  //   search: string;
  //   searchResults:
  //     | {
  //         place: string;
  //         type: string;
  //         key: string;
  //       }[]
  //     | undefined;
  // }>({
  //   isOpen: false,
  //   search: "",
  //   searchResults: undefined,
  // });
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputSearchByLocalRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch((prev) => ({ ...prev, search: e.target.value }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  function clearSearch() {
    setSearch({ search: "", searchResults: undefined });
  }

  useEffect(() => {
    function handleMakeSearch() {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      setLoading(true);

      debounceTimeout.current = setTimeout(() => {
        setLoading(false);
        setSearch((prev) => ({
          ...prev,
          searchResults: Array.from({ length: 50 }).map((_, i) => {
            return {
              title: "Product no" + i,
              price: Math.floor(Math.random() * 10000) / 100,
              image: "https://placehold.co/80x70?text=Click me!",
            };
          }),
        }));
      }, 500);
    }

    const down = (e: KeyboardEvent) => {
      if (
        e.key === `Enter` &&
        search.search !== "" &&
        inputRef.current === document.activeElement
      ) {
        handleMakeSearch();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [inputRef, inputSearchByLocalRef, search]);

  return (
    <div className="flex flex-row">
      <Button
        className="absolute top-[15px] left-[15px] w-[36px] h-[36px] p-2 flex justify-center"
        onClick={handleGoBack}
      >
        <ArrowBack className="h-4 w-4" />
      </Button>
      <div
        className={`flex flex-col w-screen h-screen min-h-screen items-center gap-10 p-[15px] transition-all duration-300 ${
          search.searchResults || loading ? "justify-start" : "justify-center"
        }`}
      >
        <div className="flex flex-row items-center justify-center gap-2 w-full">
          <div className="bg-slate-100 w-1/2 lg:w-1/3  h-[36px] rounded-md shadow-md flex flex-row items-center justify-center p-2">
            <SearchIcon className="h-4 w-4 text-slate-600" />
            <Input
              className="w-full text-slate-900 border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-white focus-visible:ring-white"
              placeholder="Search by anything"
              ref={inputRef}
              value={search.search}
              onChange={handleSearch}
            ></Input>
            {search.search !== "" && (
              <Cross2Icon
                onClick={clearSearch}
                className="h-4 w-4 text-slate-600 hover:cursor-pointer"
              />
            )}
          </div>
          {search.searchResults && <SearchByLocal />}
        </div>
        {(loading || search.searchResults) && (
          <div className="flex flex-row gap-2 flex-wrap items-center justify-center p-6 h-full w-full overflow-y-auto">
            {loading &&
              Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="w-[150px] h-[150px] m-8" />
              ))}
            {!loading &&
              search.searchResults &&
              search.searchResults.map((result, i) => (
                <ProductOnResult
                  key={i}
                  title={result.title}
                  image={result.image}
                  price={result.price}
                />
              ))}
          </div>
        )}

        {!(search.searchResults || loading) && (
          <div className="w-full lg:w-2/3 flex flex-row items-center justify-center gap-8">
            <div className="w-1/3 lg:w-1/4 h-full">
              <p className="text-xs pb-2">New products at your local market</p>
              <div className="w-full h-full rounded-lg border-slate-100 border-2 grid grid-cols-2 gap-4 p-2 items-start">
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
              </div>
            </div>
            <div className="w-1/3 lg:w-1/4 h-full">
              <p className="text-xs pb-2">Pickup where you have left</p>
              <div className="w-full h-full rounded-lg border-slate-100 border-2 grid grid-cols-2 gap-4 p-2 items-start">
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
              </div>
            </div>
            <div className="w-1/3 lg:w-1/4 h-full">
              <p className="text-xs pb-2">
                Deals based on items previously searched
              </p>
              <div className="w-full h-full rounded-lg border-slate-100 border-2 grid grid-cols-2 gap-4 p-2 items-start">
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
                <ProductOnCard
                  title="Lorem Ipsum"
                  image="https://placehold.co/80x70?text=Click me!"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductOnCard(props: { title: string; image: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-between hover:scale-110 transition-all duration-300 hover:cursor-pointer">
      <img
        src={props.image}
        className="w-auto h-full rounded-sm object-cover mt-1"
      />
      <p className="text-sm text-center mt-1">{props.title}</p>
    </div>
  );
}

function ProductOnResult(props: {
  title: string;
  image: string;
  price: number;
}) {
  return (
    <div className="h-[150px] flex flex-col items-center justify-between hover:scale-110 transition-all duration-300 hover:cursor-pointer">
      <img
        src={props.image}
        className="w-auto h-full rounded-sm object-cover mt-1"
      />
      <p className="font-semibold text-center mt-1">{props.title}</p>
      <p className="text-xs text-center mt-1">
        ${props.price.toLocaleString()}
      </p>
    </div>
  );
}