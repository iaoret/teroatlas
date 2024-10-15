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

export interface Q1Totals {
  total_emp: number;
  total_est: number;
}

export interface Q1Top10BySubUnit {
  zip: number;
  name: string;
  total: number;
}
