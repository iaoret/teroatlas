import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserMenu } from "@/components/user-menu";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/dashboard");
  }

  return (
    <>
      <div className="h-12 fixed top-0 left-0 right-0 bg-primary-foreground text-primary-content flex flex-row justify-between items-center px-4 py-2">
        <h1 className="text-4xl font-bold">title</h1>
        <div className="flex flex-row items-center justify-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-3xl font-bold">Hello, Lorem Ipsum</h2>
        <p>Welcome to the system, these are the dashboards available to you</p>
        <div className="grid 2xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-1 gap-4">
          <DashboardItem onClick={handleClick} />
          <DashboardItem onClick={handleClick} />
          <DashboardItem onClick={handleClick} />
          <DashboardItem onClick={handleClick} />
          <DashboardItem onClick={handleClick} />
          <DashboardItem onClick={handleClick} />
        </div>
        <Button>Create new dashboard</Button>
      </div>
    </>
  );
}

function DashboardItem(props: { onClick?: () => void }) {
  return (
    <Card
      className="bg-primary-foreground hover:bg-slate-700 hover:shadow-lg transition-all duration-200 rounded-lg hover:cursor-pointer"
      onClick={props.onClick}
    >
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
