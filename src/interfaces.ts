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
  chartInfo: string;
}
export interface Q2DashboardData {
  boundingBox: number[];
  choroplethicData: {
    maxEmp: number;
    maxEst: number;
    minEmp: number;
    minEst: number;
  };
  q2Totals: Q2Totals[];
  q2Top10BySubUnit: Q2Top10BySubUnit[];
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
export interface Q2Totals {
  total_emp: number | null;
  total_est: number | null;
}

export interface Q2Top10BySubUnit {
  zip: number | null;
  name: string | null;
  total: number | null;
}
