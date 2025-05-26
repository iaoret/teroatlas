import client from "./db";

interface SearchParams {
  length?: null;
  time?: { years: number[] };
  intensity?: { variable: string; order: string };
  breadth?: null;
}

// Helper for defaults
const Q1_DEFAULTS: SearchParams = {
  length: null,
  time: { years: [2019, 2020, 2021, 2022] },
  intensity: { variable: "emp", order: "desc" },
  breadth: null,
};

function matchDashboardKey(
  query: string
): "q1" | "q2" | "q3" | "q4" | undefined {
  const lower = query.toLowerCase();
  if (
    lower.includes("dc") &&
    lower.includes("congressional district") &&
    lower.includes("economic data")
  )
    return "q1";
  if (
    lower.includes("new york") &&
    lower.includes("manufacturing economic data") &&
    lower.includes("1st congressional district")
  )
    return "q2";
  if (
    lower.includes("dc") &&
    lower.includes("jobs per housing unit stats") &&
    lower.includes("ward")
  )
    return "q3";
  if (
    lower.includes("nyc") &&
    lower.includes("lowest gross income as full market value") &&
    lower.includes("borough block")
  )
    return "q4";
  return undefined;
}

async function getQ1DashboardData(searchParams?: Partial<SearchParams>) {
  // Merge defaults with provided searchResults
  const merged = {
    ...Q1_DEFAULTS,
    ...searchParams,
    time: { ...Q1_DEFAULTS.time, ...(searchParams?.time || {}) },
    intensity: {
      ...Q1_DEFAULTS.intensity,
      ...(searchParams?.intensity || {}),
    },
  };

  console.log(merged);

  const years = merged.time.years;
  const variable = merged.intensity.variable;
  const order = merged.intensity.order;

  const yearsSet = `{${years.join(",")}}`;

  const q1Totals = (
    await client.query(
      `SELECT * FROM get_total_emp_est_by_district_and_years($1, $2)`,
      [1, yearsSet]
    )
  ).rows;

  const q1Top10BySubUnit = (
    await client.query(`SELECT * FROM get_top_10_zip_codes($1, $2, $3, $4)`, [
      1,
      yearsSet,
      variable,
      order,
    ])
  ).rows;

  const boundingBox = (await client.query(`SELECT * FROM get_q1_extent()`))
    .rows[0];

  const choropleticData = (
    await client.query(`SELECT * FROM get_min_max_emp_est()`)
  ).rows[0];

  const coverage = (
    await client.query(`SELECT * FROM q1_area_coverage_by_subunits($1)`, [1])
  ).rows[0]?.coverage;

  return {
    q1Totals,
    q1Top10BySubUnit,
    boundingBox,
    choroplethicData: {
      minEmp: choropleticData.min_emp,
      maxEmp: choropleticData.max_emp,
      minEst: choropleticData.min_est,
      maxEst: choropleticData.max_est,
    },
    chartInfo: "",
    coverage,
  };
}

async function getQ2DashboardData() {
  const naics = "31---";
  const q2Totals = (
    await client.query(
      `SELECT * FROM get_total_emp_est_by_district_and_naics_in_nys($1, $2)`,
      [1, naics]
    )
  ).rows;

  const q2Top10BySubUnit = (
    await client.query(
      `SELECT * FROM get_top_10_zip_codes_nys_by_district_id_naics_code($1, $2, $3, $4)`,
      [1, naics, "aprox_emp", "desc"]
    )
  ).rows;

  const boundingBox = (await client.query(`SELECT * FROM get_q2_extent()`))
    .rows[0];

  const choropleticData = (
    await client.query(
      `SELECT * FROM get_min_max_emp_est_by_district_and_naics_code_in_nys($1, $2)`,
      [1, naics]
    )
  ).rows[0];

  const q2Data = (
    await client.query(
      `SELECT * FROM q2_zip_code_econ_data_with_geojson WHERE id_q2_nys_congressional_districts = 1 AND naics LIKE $1 LIMIT 100`,
      [`%${naics}%`]
    )
  ).rows;

  const coverage = (
    await client.query(`SELECT * FROM q2_area_coverage_by_subunits($1, $2)`, [
      naics,
      1,
    ])
  ).rows[0]?.coverage;

  return {
    q2Totals,
    q2Top10BySubUnit,
    q2Data,
    boundingBox,
    choroplethicData: {
      minEmp: choropleticData.min_emp,
      maxEmp: choropleticData.max_emp,
      minEst: choropleticData.min_est,
      maxEst: choropleticData.max_est,
    },
    chartInfo: "",
    coverage,
  };
}

async function getQ3DashboardData() {
  const ward = "1";
  const q3Totals = (
    await client.query(
      `SELECT * FROM get_total_emp_and_housing_in_dc_by_ward($1)`,
      [ward]
    )
  ).rows;

  const boundingBox = (
    await client.query(`SELECT * FROM get_q3_extent($1)`, [ward])
  ).rows[0];

  const choropleticData = (
    await client.query(
      `SELECT * FROM get_min_max_emp_housing_ratio_on_zip_code_by_ward($1)`,
      [ward]
    )
  ).rows[0];

  const q3Data = (
    await client.query(
      `SELECT zip, name, emp FROM q3_dc_zip_codes_est_jobs_wards WHERE ward_name = $1`,
      [ward]
    )
  ).rows;

  const coverage = (
    await client.query(`SELECT * FROM q3_area_coverage_by_subunits($1)`, [ward])
  ).rows[0]?.coverage;

  return {
    q3Totals,
    q3Data,
    boundingBox,
    choroplethicData: {
      minRatio: choropleticData.min_ratio,
      maxRatio: choropleticData.max_ratio,
    },
    chartInfo: "",
    coverage,
  };
}

async function getQ4DashboardData() {
  const q4Data = (
    await client.query(
      `SELECT * FROM q4_nyc_boro_block_economic_data ORDER BY perc_gross_income_as_full_market_value ASC NULLS LAST LIMIT 1`
    )
  ).rows;

  const borough = q4Data[0]?.borough;
  const block = q4Data[0]?.block;
  const uid = q4Data[0]?.uid;

  const q4HistoricalData = (
    await client.query(
      `SELECT * FROM get_perc_gross_income_as_full_market_value_over_the_years($1, $2)`,
      [borough, block]
    )
  ).rows;

  const boundingBox = (
    await client.query(`SELECT * FROM get_q4_extent($1)`, [uid])
  ).rows[0];

  const choropleticData = (
    await client.query(`SELECT * FROM get_min_max_boro_block_perc_in_nyc()`)
  ).rows[0];

  return {
    q4Data,
    q4HistoricalData,
    boundingBox,
    choroplethicData: {
      minPerc: choropleticData.min_perc_gross_income_as_full_market_value,
      maxPerc: choropleticData.max_perc_gross_income_as_full_market_value,
    },
    coverage: 1,
  };
}

const queryService = async (query: string, searchResults?: SearchParams) => {
  const dashboardKey = matchDashboardKey(query);
  if (!dashboardKey) throw new Error("No dashboard matches this query");

  switch (dashboardKey) {
    case "q1":
      return { dashboardKey, data: await getQ1DashboardData(searchResults) };
    case "q2":
      return { dashboardKey, data: await getQ2DashboardData() };
    case "q3":
      return { dashboardKey, data: await getQ3DashboardData() };
    case "q4":
      return { dashboardKey, data: await getQ4DashboardData() };
    default:
      throw new Error("Unknown dashboard key");
  }
};

export default queryService;
