import DashboardItem from "@/components/dashboard-item";
import { AddCircle } from "@/components/icons/add-circle";
import { Calendar } from "@/components/icons/calendar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function handleClick(destination: string) {
    navigate(destination);
  }

  return (
    <div className="min-w-[100vw]">
      <div className="h-12 fixed top-0 left-0 right-0 bg-primary-foreground text-primary-content flex flex-row justify-between items-center px-4 py-2">
        <div className="flex flex-row items-center gap-0">
          <div className="text-4xl font-bold">Tero</div>
          <div className="text-4xl font-bold text-tero-100">Atlas</div>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-3xl">
          Welcome, <b>Christopher</b>
        </h2>
        <p>Choose a dashboard below to start</p>
        <div className="grid 2xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-4 mt-10">
          <DashboardItem
            image={<img src={"https://placehold.co/300x300"} alt="" />}
            title={"Economic Data"}
            description={
              "This dashboard displays trends and statistics for various economic data across the United Stated"
            }
            footer={
              <div className="flex flex-row items-center gap-2">
                <Calendar />
                <p className="text-xs font-extralight italic">
                  Created at October 10th 2024
                </p>
              </div>
            }
            onClick={() => handleClick("/dashboard/economic-data")}
          />
          <DashboardItem
            image={<img src="https://placehold.co/300x300" alt="" />}
            title={"Items for Sale"}
            description={
              "This dashboard allows to filter and visualize products on sale by city, ward or ZIP Code"
            }
            footer={
              <div className="flex flex-row items-center gap-2">
                <Calendar />
                <p className="text-xs font-extralight italic">
                  Created at October 10th 2024
                </p>
              </div>
            }
            onClick={() => handleClick("/dashboard/retail")}
          />
        </div>
        <Button variant={"outline"} className="bg-tero-100 mt-10">
          <AddCircle /> &nbsp; Create new dashboard using TeroAtlas' technology
          ®
        </Button>
      </div>
    </div>
  );
}
