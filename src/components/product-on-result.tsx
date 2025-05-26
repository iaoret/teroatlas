export default function ProductOnResult(props: {
  title: string;
  image: string;
  vendor: string;
  price: number;
}) {
  return (
    <div className="h-[170px] w-[200px] flex flex-col items-center justify-between hover:cursor-pointer mb-4">
      <img
        src={props.image}
        className="w-[100px] h-[100px] rounded-sm object-cover mt-1 hover:scale-105 transition-all duration-300 "
      />
      <p className="font-semibold text-center mt-1">{props.title}</p>
      <p className="text-xs text-center italic">by {props.vendor}</p>
      <p className="text-xs text-center mt-1">
        ${props.price.toLocaleString()}
      </p>
    </div>
  );
}
