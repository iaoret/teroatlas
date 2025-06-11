export interface Q1SearchResults {
  length: null;
  time: {
    years: number[];
  };
  intensity: {
    variable: string;
    order: string;
  };
  breadth: null;
}

export interface Q1DashboardData {
  boundingBox: number[];
  choroplethicData: {
    maxEmp: number;
    maxEst: number;
    minEmp: number;
    minEst: number;
  };
  q1Totals: Q1Totals[];
  q1Top10BySubUnit: Q1Top10BySubUnit[];
  coverage: number;
  chartInfo: string;
}

export interface Q1Totals {
  total_emp: number | null;
  total_est: number | null;
}

export interface Q1Top10BySubUnit {
  zip: number | null;
  name: string | null;
  total: number | null;
}

export interface Q2DashboardData {
  boundingBox: number[];
  choroplethicData: {
    maxEmp: number;
    maxEst: number;
    minEmp: number;
    minEst: number;
  };
  q2Data: Q2Data[];
  q2Totals: Q2Totals[];
  q2Top10BySubUnit: Q2Top10BySubUnit[];
  coverage: number;
  chartInfo: string;
}

export interface Q2SearchResults {
  length: null;
  time: null;
  intensity: {
    variable: string;
    order: string;
  };
  breadth: {
    naics: string;
  };
}

export interface Q2Totals {
  total_emp: number | null;
  total_est: number | null;
}

export interface Q2Top10BySubUnit {
  zip: number | null;
  name: string | null;
  total: number | null;
}

export interface Q2Data {
  id_q2_zip_code_econ_data_with_geom: number;
  id: number;
  zip: number;
  name: string;
  naics: string;
  est: number;
  "n<5": string;
  n5_9: string;
  n10_19: string;
  n20_49: string;
  n50_99: string;
  n100_249: string;
  n250_499: string;
  n500_999: string;
  n1000: string;
  city: string;
  stabbr: string;
  cty_name: string;
  id_q2_nys_zip_codes: number;
  id_q2_nys_congressional_districts: number;
  geojson: string;
  geom: {
    type: string;
    crs: {
      type: string;
      properties: {
        name: string;
      };
    };
    coordinates: number[][][];
  };
}

export interface Q3DashboardData {
  boundingBox: number[];
  choroplethicData: {
    minRatio: number;
    maxRatio: number;
  };
  q3Data: Q3Data[];
  q3Totals: Q3Totals[];
  coverage: number;
  chartInfo: string;
}
export interface Q3SearchResults {
  place: string | null;
  length: null;
  time: null;
  intensity: {
    variable: string;
    order: string;
  };
  breadth: null;
}

export interface Q3Totals {
  total_emp: number | null;
  count_zip: number | null;
  total_housing: number | null;
  total_ratio: number | null;
}

export interface Q3Data {
  uid: number;
  zip: number;
  emp: number;
}

export interface Q4DashboardData {
  boundingBox: number[];
  choroplethicData: {
    minPerc: number;
    maxPerc: number;
  };
  q4Data: Q4Data[];
  q4HistoricalData: Q4HistoricalData[];
  coverage: number;
}

export interface Q4SearchResults {
  length: null;
  time: {
    years: number[];
  };
  intensity: {
    variable: string;
    order: string;
  };
  breadth: null;
}

export interface Q4HistoricalData {
  borough: string;
  block: number;
  year: number;
  avg_estimated_gross_income: number;
  avg_full_market_value: number;
  perc_gross_income_as_full_market_value: number;
}

export interface Q4Data {
  uid: number;
  borough: string;
  block: number;
  avg_estimated_gross_income: number;
  avg_full_market_value: number;
  perc_gross_income_as_full_market_value: number;
  number_of_obs: number;
}

export interface Q6SearchResults {
  length: null;
  time: null;
  intensity: {
    variable: string;
    order: string;
  };
  breadth: null;
}

export interface Q6DashboardData {
  q6BoundingBox: number[];
  choroplethicData: {
    maxEmp: number;
    maxEst: number;
    minEmp: number;
    minEst: number;
  };
  q6Totals: Q6Totals;
  q6Top10BySubUnit: Q6Top10BySubUnit[];
  coverage: number;
  chartInfo: {
    title: string;
    info: string;
  };
  mapInfo: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zipCodes: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    congressionalDistricts: any;
  };
}

export interface Q6Totals {
  total_emp: number | null;
  total_est: number | null;
}

export interface Q6Top10BySubUnit {
  zip: number | null;
  name: string | null;
  total: number | null;
}


export interface Q7SearchResults {
  length: null;
  time: null;
  intensity: {
    variable: string;
    order: string;
  };
  breadth: {
    naics: string;
  };
}

export interface Q7Totals {
  total_emp: number | null;
  total_est: number | null;
}

export interface Q7Top10BySubUnit {
  zip: number | null;
  name: string | null;
  total: number | null;
}

export interface Q7DashboardData {
  boundingBox: number[];
  choroplethicData: {
    maxEmp: number;
    maxEst: number;
    minEmp: number;
    minEst: number;
  };
  q7Totals: Q7Totals;
  q7Top10BySubUnit: Q7Top10BySubUnit[];
  q7BoundingBox: number[];
  coverage: number;
  chartInfo: {
    title: string;
    info: string;
  };
  mapInfo: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zipCodes: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    congressionalDistricts: any;
  };
}
