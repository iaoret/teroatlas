const environment = {
  development: {
    production: false,
    urlTiles: "http://localhost:6433",
    urlRest: "http://localhost:6434",
  },
  "marotta.dev": {
    production: true,
    urlTiles: "https://tero-atlas-tiles.marotta.dev",
    urlRest: "https://tero-atlas-rest.marotta.dev",
  },
};

export default environment[
  (import.meta.env.VITE_APP_ENVIRONMENT as "marotta.dev") || "development"
];