import { ArrowBack } from "@/components/icons/arrow-back";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Cross2Icon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RetailHome() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<
    | {
        title: string;
        price: number;
        image: string;
      }[]
    | undefined
  >();
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  function handleSearch(e: React.FormEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }

  function clearSearch() {
    setSearch("");
    setSearchResults(undefined);
  }

  useEffect(() => {
    function handleMakeSearch() {
      console.log(`searching by ${search}`);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      setLoading(true);

      debounceTimeout.current = setTimeout(() => {
        setLoading(false);
        setSearchResults([
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
          {
            title: "Lorem Ipsum",
            price: Math.floor(Math.random() * 100),
            image: "https://placehold.co/80x70?text=Click me!",
          },
        ]);
      }, 500);
    }

    const down = (e: KeyboardEvent) => {
      if (
        e.key === `Enter` &&
        search !== "" &&
        inputRef.current === document.activeElement
      ) {
        handleMakeSearch();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [inputRef, search]);

  return (
    <>
      <div
        className={`flex flex-col w-screen h-screen min-h-screen items-center gap-10 p-[15px] transition-all duration-300 ${
          searchResults || loading ? "justify-start" : "justify-center"
        }`}
      >
        <Button
          className="absolute top-[15px] left-[15px] w-[36px] h-[36px] p-2 flex justify-center"
          onClick={handleGoBack}
        >
          <ArrowBack className="h-4 w-4" />
        </Button>
        <div className="bg-slate-100 w-1/2 lg:w-1/3 h-[36px] rounded-md shadow-md flex flex-row items-center justify-center p-2">
          <SearchIcon className="h-4 w-4 text-slate-600" />
          <Input
            className="w-full text-slate-900 border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-white focus-visible:ring-white"
            placeholder="Search by anything"
            ref={inputRef}
            value={search}
            onInput={handleSearch}
          ></Input>
          {search !== "" && (
            <Cross2Icon
              onClick={clearSearch}
              className="h-4 w-4 text-slate-600 hover:cursor-pointer"
            />
          )}
        </div>
        {(loading || searchResults) && (
          <div className="flex flex-row gap-8 flex-wrap items-center justify-center p-8 h-full overflow-y-auto">
            {loading &&
              Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-32" />
              ))}
            {!loading &&
              searchResults &&
              searchResults.map((result, i) => (
                <ProductOnCard
                  key={i}
                  title={result.title}
                  image={result.image}
                />
              ))}
          </div>
        )}

        {!(searchResults || loading) && (
          <div className="w-full flex flex-row items-center justify-center flex-wrap gap-8">
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
    </>
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
