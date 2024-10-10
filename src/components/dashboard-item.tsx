import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";

export default function DashboardItem(props: {
  title: ReactNode;
  description: ReactNode;
  footer: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Card
      className="bg-primary-foreground hover:bg-zinc-800 hover:shadow-lg transition-all duration-200 rounded-lg hover:cursor-pointer max-w-[400px]"
      onClick={props.onClick}
    >
      <div className="flex flex-row items-center">
        <div className="min-h-40 min-w-40 mt-1 ml-4 rounded-l-md bg-black"></div>
        <div>
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{props.description}</CardContent>
          <CardFooter>{props.footer}</CardFooter>
        </div>
      </div>
    </Card>
  );
}
