import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";

export default function DashboardItem(props: {
  image: ReactNode;
  title: ReactNode;
  description: ReactNode;
  footer: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-row items-center justify-center">
      <Card
        className="bg-primary-foreground hover:bg-zinc-800 hover:shadow-lg transition-all duration-200 rounded-lg hover:cursor-pointer max-w-[400px] w-full"
        onClick={props.onClick}
      >
        <div className="h-full flex flex-row items-center">
          <div className="w-full rounded-full bg-black flex flex-col justify-center items-center">
            {props.image}
          </div>
          <div></div>
        </div>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">{props.description}</CardContent>
        <CardFooter>{props.footer}</CardFooter>
      </Card>
    </div>
  );
}
