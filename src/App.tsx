import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import EconomicData from "./pages/Dashboard/EconomicData";
import { Toaster } from "sonner";
import RetailHome from "./pages/Dashboard/RetailHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard/economic-data",
    element: <EconomicData />,
  },
  {
    path: "/dashboard/retail-home",
    element: <RetailHome />,
  },
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
