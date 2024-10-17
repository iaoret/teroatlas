import { ThemeProvider } from "./components/theme-provider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/index.tsx";
import EconomicData from "./pages/dashboard/economic-data.tsx";
import RetailHome from "./pages/dashboard/retail-home.tsx";
import RetailMap from "./pages/dashboard/retail-map.tsx";

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
