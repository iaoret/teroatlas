import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import EconomicData from "./pages/Dashboard/EconomicData";
import RetailHome from "./pages/Dashboard/RetailHome";
import RetailMap from "./pages/Dashboard/RetailMap";

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
  {
    path: "/dashboard/retail-map",
    element: <RetailMap />,
  },
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
