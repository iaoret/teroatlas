const environment = {
  development: {
    production: false,
    urlTiles: "http://localhost:6433",
    urlRest: "http://localhost:6434",
    urlAPI: "http://localhost:6435",
  },
  "teroatlas.ai": {
    production: true,
    urlTiles: "https://tiles.teroatlas.ai",
    urlRest: "https://rest.teroatlas.ai",
    urlAPI: "https://api.teroatlas.ai",
  },
};

export default environment[
  (import.meta.env.VITE_APP_ENVIRONMENT as "teroatlas.ai") || "development"
];