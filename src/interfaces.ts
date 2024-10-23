export interface SearchResults {
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

export interface DashboardData {
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
    

export interface Q1Totals {
  total_emp: number;
  total_est: number;
}

export interface Q1Top10BySubUnit {
  zip: number;
  name: string;
  total: number;
}
