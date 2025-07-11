import { usStates } from "../lib";
import client from "./db";
import logger from "../logger";

interface SearchParams {
  queryKey: string;
  length?: null;
  time?: { years: number[] };
  intensity?: { variable: string; order: string };
  breadth?: {
    naics?: string;
  };
}

// Helper for defaults
const Q1_DEFAULTS: SearchParams = {
  queryKey: "",
  length: null,
  time: { years: [2019, 2020, 2021, 2022] },
  intensity: { variable: "emp", order: "desc" },
  breadth: null,
};

const Q6_DEFAULTS: SearchParams = {
  queryKey: "",
  length: null,
  time: null,
  intensity: { variable: "emp", order: "desc" },
  breadth: null,
};

const Q7_DEFAULTS: SearchParams = {
  queryKey: "",
  length: null,
  time: null,
  intensity: { variable: "emp", order: "desc" },
  breadth: {
    naics: "31---",
  },
};

function matchDashboardKey(
  query: string
): "q1" | "q2" | "q3" | "q4" | "q6" | "q7" | undefined {
  const lower = query.toLowerCase();
  if (
    lower.includes("dc") &&
    lower.includes("congressional district") &&
    lower.includes("economic data")
  )
    return "q1";
  if (
    lower.includes("new york") &&
    lower.includes("manufacturing data") &&
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
  if (
    usStates.some((state) => lower.includes(state)) &&
    lower.includes("economic data") &&
    lower.includes("congressional district")
  ) {
    return "q6";
  }
  if (
    usStates.some((state) => lower.includes(state)) &&
    lower.includes("manufacturing data") &&
    lower.includes("congressional district")
  ) {
    return "q7";
  }
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

const getQ6DashboardData = async (searchParams?: Partial<SearchParams>) => {
  const merged = {
    ...Q6_DEFAULTS,
    ...searchParams,
  };

  const lowerQuery = merged.queryKey.toLowerCase();
  const stateKeys = usStates.filter((state) => lowerQuery.includes(state));

  const cdKey = merged.queryKey.split(" ").filter((e) => !isNaN(Number(e)));

  const stateQuery = stateKeys
    .map((key) => `state_name ILIKE '%${key}%' OR state_abbr ILIKE '%${key}%'`)
    .join(" OR ");

  const cdQuery =
    cdKey.length === 0
      ? `cd_name = 'Congressional District (at Large)'`
      : cdKey
          .map((e) => `cd_name = 'Congressional District ${e}'`)
          .join(" OR ");

  // CREATE TABLE IF NOT EXISTS public.q6_cd_economic_data
  // (
  //     id bigint,
  //     cd_geoid character varying COLLATE pg_catalog."default",
  //     cd_name character varying COLLATE pg_catalog."default",
  //     state_name character varying(100) COLLATE pg_catalog."default",
  //     state_geoid character varying(2) COLLATE pg_catalog."default",
  //     state_abbr character varying COLLATE pg_catalog."default",
  //     total_est bigint,
  //     total_emp bigint,
  //     zip_count bigint,
  //     zip_geom jsonb,
  //     geom geometry(MultiPolygon,4269)
  // )

  const queryQ6Totals = `
    SELECT
      sum(total_emp) as total_emp
      , sum(total_est) as total_est
      , ST_AsText(ST_Union(geom)) as geom
      , string_agg(DISTINCT cd_name, ', ') || ' - ' || MAX(state_name) as chart_info_title
      , jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
          jsonb_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(cd_geom)::jsonb
          )
        )
      ) as cd_geojson
      , jsonb_build_object(
        'type', 'FeatureCollection',
        'features', (
          SELECT jsonb_agg(feature)
          FROM (
            SELECT jsonb_array_elements(zip_geom->'features') as feature
            FROM q6_cd_economic_data
            WHERE (${stateQuery}) AND (${cdQuery})
          ) features
        )
      ) as zip_geojson
    FROM (
      SELECT cd.id, s.*, cd.geom as cd_geom
      FROM (
        SELECT * 
        FROM q6_cd_economic_data 
        WHERE (${stateQuery}) AND (${cdQuery})
      ) s
      LEFT JOIN public.q6_us_congressional_districts_merged cd
        ON cd."GEOID" = cd_geoid AND state_geoid = cd."STATEFP"
      WHERE ST_IsValid(cd.geom)
    ) s
  `;

  const startQ6Totals = Date.now();
  const q6Totals = (await client.query(queryQ6Totals)).rows;
  logger.info(`query6Totals took ${Date.now() - startQ6Totals}ms`);

  const queryQ6Top10BySubUnit = `
    SELECT * FROM (
      SELECT
        z.zip, 
        z.${searchParams.intensity.variable} total, 
        z.stabbr state_abbr, 
        COALESCE(zcd."NAMELSAD_CD118_20", 'Unidentified') cd_name, 
        COALESCE("GEOID_CD118_20", '9999') cd_geoid, 
        s."NAME" state_name,
        s."GEOID" state_geoid
      FROM public.q6_zbp22totals z
      LEFT JOIN public.q6_zip_code_to_congressional_district zcd 
        ON z.zip = zcd."GEOID_ZCTA5_20"
      LEFT JOIN public.q6_cb_2018_us_state_500k s
        ON s."STUSPS" = z.stabbr
      ) s
    WHERE (${stateQuery}) AND (${cdQuery})
    ORDER BY total ${searchParams.intensity.order}
    LIMIT 10
  `;

  const startQ6Top10BySubUnit = Date.now();
  const q6Top10BySubUnit = (await client.query(queryQ6Top10BySubUnit)).rows;
  logger.info(
    `query6Top10BySubUnit took ${Date.now() - startQ6Top10BySubUnit}ms`
  );

  const q6Geom = q6Totals[0]?.geom;

  const queryQ6BoundingBox = `
    SELECT ST_AsText(ST_Envelope(ST_GeomFromText('${q6Geom}'))) as geom
  `;

  const startQ6BoundingBox = Date.now();
  const q6BoundingBox = (await client.query(queryQ6BoundingBox)).rows[0]?.geom;
  logger.info(`query6BoundingBox took ${Date.now() - startQ6BoundingBox}ms`);

  const queryQ6ChoroplethData = `
    SELECT min(emp) as min_emp, max(emp) as max_emp, min(est) as min_est, max(est) as max_est FROM (
      SELECT
        z.zip, 
        z.emp, 
        z.est, 
        z.stabbr state_abbr, 
        COALESCE(zcd."NAMELSAD_CD118_20", 'Unidentified') cd_name, 
        COALESCE("GEOID_CD118_20", '9999') cd_geoid, 
        s."NAME" state_name,
        s."GEOID" state_geoid
      FROM public.q6_zbp22totals z
      LEFT JOIN public.q6_zip_code_to_congressional_district zcd 
        ON z.zip = zcd."GEOID_ZCTA5_20"
      LEFT JOIN public.q6_cb_2018_us_state_500k s
        ON s."STUSPS" = z.stabbr
      ) s
    WHERE (${stateQuery}) AND (${cdQuery})
  `;

  const startQ6ChoroplethData = Date.now();
  const q6ChoroplethData = (await client.query(queryQ6ChoroplethData)).rows[0];
  logger.info(
    `query6ChoroplethData took ${Date.now() - startQ6ChoroplethData}ms`
  );

  const queryQ6CoverageSubset = `
    SELECT sum(${searchParams.intensity.variable}) as subset FROM (
      SELECT
        z.zip, 
        z.emp, 
        z.est, 
        z.stabbr state_abbr, 
        COALESCE(zcd."NAMELSAD_CD118_20", 'Unidentified') cd_name, 
        COALESCE("GEOID_CD118_20", '9999') cd_geoid, 
        s."NAME" state_name,
        s."GEOID" state_geoid
      FROM public.q6_zbp22totals z
      LEFT JOIN public.q6_zip_code_to_congressional_district zcd 
        ON z.zip = zcd."GEOID_ZCTA5_20"
      LEFT JOIN public.q6_cb_2018_us_state_500k s
        ON s."STUSPS" = z.stabbr
      ) s
    WHERE (${stateQuery}) AND (${cdQuery})
  `;

  const queryQ6CoverageTotal = `
    SELECT sum(${searchParams.intensity.variable}) as total FROM (
      SELECT
        z.zip, 
        z.emp, 
        z.est, 
        z.stabbr state_abbr, 
        COALESCE(zcd."NAMELSAD_CD118_20", 'Unidentified') cd_name, 
        COALESCE("GEOID_CD118_20", '9999') cd_geoid, 
        s."NAME" state_name,
        s."GEOID" state_geoid
      FROM public.q6_zbp22totals z
      LEFT JOIN public.q6_zip_code_to_congressional_district zcd 
        ON z.zip = zcd."GEOID_ZCTA5_20"
      LEFT JOIN public.q6_cb_2018_us_state_500k s
        ON s."STUSPS" = z.stabbr
      ) s
    WHERE (${stateQuery}) 
  `;

  const startQ6Coverage = Date.now();
  const q6CoverageSubset = (await client.query(queryQ6CoverageSubset)).rows;
  const q6CoverageTotal = (await client.query(queryQ6CoverageTotal)).rows;
  logger.info(`query6Coverage took ${Date.now() - startQ6Coverage}ms`);

  const q6Coverage = q6CoverageSubset[0]?.subset / q6CoverageTotal[0]?.total;

  return {
    q6Totals: {
      total_emp: q6Totals[0]?.total_emp,
      total_est: q6Totals[0]?.total_est,
    },
    q6Top10BySubUnit,
    q6BoundingBox,
    choroplethicData: {
      minEmp: q6ChoroplethData.min_emp,
      maxEmp: q6ChoroplethData.max_emp,
      minEst: q6ChoroplethData.min_est,
      maxEst: q6ChoroplethData.max_est,
    },
    chartInfo: {
      title: q6Totals[0]?.chart_info_title,
      info: `Calculated using data from ${
        q6Totals[0]?.zip_count
      } ZIP Codes within target geography in the year of 2022, this represents ${(
        q6Coverage * 100
      ).toFixed(2)}% of the total target geography`,
    },
    mapInfo: {
      zipCodes: q6Totals[0]?.zip_geojson,
      congressionalDistricts: q6Totals[0]?.cd_geojson,
    },
    coverage: q6Coverage,
  };
};

const getQ7DashboardData = async (searchParams?: Partial<SearchParams>) => {
  const merged = {
    ...Q7_DEFAULTS,
    ...searchParams,
  };

  const lowerQuery = merged.queryKey.toLowerCase();
  const stateKeys = usStates.filter((state) => lowerQuery.includes(state));

  const cdKey = merged.queryKey.split(" ").filter((e) => !isNaN(Number(e)));

  const stateQuery = stateKeys
    .map((key) => `state_name ILIKE '%${key}%' OR state_abbr ILIKE '%${key}%'`)
    .join(" OR ");

  const cdQuery =
    cdKey.length === 0
      ? `cd_name = 'Congressional District (at Large)'`
      : cdKey
          .map((e) => `cd_name = 'Congressional District ${e}'`)
          .join(" OR ");

  const queryQ7Totals = `
    SELECT
      sum(total_emp) as total_emp
      , sum(total_est) as total_est
      , (
          SELECT count(1)
          FROM jsonb_array_elements(
            (
              SELECT zip_geom->'features'
              FROM q7_cd_economic_data
              WHERE (${stateQuery}) AND (${cdQuery}) AND naics LIKE '%${merged.breadth.naics}%'
              LIMIT 1
            )
          )
        ) as zip_count
      , ST_AsText(ST_Union(geom)) as geom
      , string_agg(DISTINCT cd_name, ', ') || ' - ' || MAX(state_name) as chart_info_title
      , jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
          jsonb_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(cd_geom)::jsonb
          )
        )
      ) as cd_geojson
      , jsonb_build_object(
        'type', 'FeatureCollection',
        'features', (
          SELECT jsonb_agg(feature)
          FROM (
            SELECT jsonb_array_elements(zip_geom->'features') as feature
            FROM q7_cd_economic_data
            WHERE (${stateQuery}) AND (${cdQuery}) AND naics LIKE '%${merged.breadth.naics}%'
          ) features
        )
      ) as zip_geojson
    FROM (
      SELECT cd.id, s.*, cd.geom as cd_geom
      FROM (
        SELECT * 
        FROM q7_cd_economic_data 
        WHERE (${stateQuery}) AND (${cdQuery}) AND naics LIKE '%${merged.breadth.naics}%'
      ) s
      LEFT JOIN public.q6_us_congressional_districts_merged cd
        ON cd."GEOID" = cd_geoid AND state_geoid = cd."STATEFP"
      WHERE ST_IsValid(cd.geom)
    ) s
  `;

  const startQ7Totals = Date.now();
  const q7Totals = (await client.query(queryQ7Totals)).rows;
  logger.info(`query7Totals took ${Date.now() - startQ7Totals}ms`);

  const queryQ7Top10BySubUnit = `
    SELECT * FROM (
      SELECT
        z.zip, 
        z.${searchParams.intensity.variable} total, 
        z.stabbr state_abbr, 
        COALESCE(zcd."NAMELSAD_CD118_20", 'Unidentified') cd_name, 
        COALESCE("GEOID_CD118_20", '9999') cd_geoid, 
        s."NAME" state_name,
        s."GEOID" state_geoid
      FROM public.q7_zbp22detail z
      LEFT JOIN public.q6_zip_code_to_congressional_district zcd 
        ON z.zip = zcd."GEOID_ZCTA5_20"
      LEFT JOIN public.q6_cb_2018_us_state_500k s
        ON s."STUSPS" = z.stabbr
      WHERE z.naics LIKE '%${merged.breadth.naics}%'
      ) s
    WHERE (${stateQuery}) AND (${cdQuery})
    ORDER BY total ${searchParams.intensity.order}
    LIMIT 10
  `;

  const startQ7Top10BySubUnit = Date.now();
  const q7Top10BySubUnit = (await client.query(queryQ7Top10BySubUnit)).rows;
  logger.info(
    `query7Top10BySubUnit took ${Date.now() - startQ7Top10BySubUnit}ms`
  );

  const q7Geom = q7Totals[0]?.geom;

  const queryQ7BoundingBox = `
    SELECT ST_AsText(ST_Envelope(ST_GeomFromText('${q7Geom}'))) as geom
  `;

  const startQ7BoundingBox = Date.now();
  const q7BoundingBox = q7Geom
    ? (await client.query(queryQ7BoundingBox)).rows[0]?.geom
    : null;
  logger.info(`query7BoundingBox took ${Date.now() - startQ7BoundingBox}ms`);

  const queryQ7ChoroplethData = `
    SELECT min(emp) as min_emp, max(emp) as max_emp, min(est) as min_est, max(est) as max_est FROM (
      SELECT
        z.zip, 
        z.emp, 
        z.est, 
        z.stabbr state_abbr, 
        COALESCE(zcd."NAMELSAD_CD118_20", 'Unidentified') cd_name, 
        COALESCE("GEOID_CD118_20", '9999') cd_geoid, 
        s."NAME" state_name,
        s."GEOID" state_geoid
      FROM public.q7_zbp22detail z
      LEFT JOIN public.q6_zip_code_to_congressional_district zcd 
        ON z.zip = zcd."GEOID_ZCTA5_20"
      LEFT JOIN public.q6_cb_2018_us_state_500k s
        ON s."STUSPS" = z.stabbr
      WHERE z.naics LIKE '%${merged.breadth.naics}%'
      ) s
    WHERE (${stateQuery}) AND (${cdQuery})
  `;

  const startQ7ChoroplethData = Date.now();
  const q7ChoroplethData = (await client.query(queryQ7ChoroplethData)).rows[0];
  logger.info(
    `query7ChoroplethData took ${Date.now() - startQ7ChoroplethData}ms`
  );

  const queryQ7CoverageSubset = `
    SELECT sum(${searchParams.intensity.variable}) as subset FROM (
      SELECT
        z.zip, 
        z.emp, 
        z.est, 
        z.stabbr state_abbr, 
        COALESCE(zcd."NAMELSAD_CD118_20", 'Unidentified') cd_name, 
        COALESCE("GEOID_CD118_20", '9999') cd_geoid, 
        s."NAME" state_name,
        s."GEOID" state_geoid
      FROM public.q7_zbp22detail z
      LEFT JOIN public.q6_zip_code_to_congressional_district zcd 
        ON z.zip = zcd."GEOID_ZCTA5_20"
      LEFT JOIN public.q6_cb_2018_us_state_500k s
        ON s."STUSPS" = z.stabbr
      WHERE z.naics LIKE '%${merged.breadth.naics}%'
      ) s
    WHERE (${stateQuery}) AND (${cdQuery})
  `;

  const queryQ7CoverageTotal = `
    SELECT sum(${searchParams.intensity.variable}) as total FROM (
      SELECT
        z.zip, 
        z.emp, 
        z.est, 
        z.stabbr state_abbr, 
        COALESCE(zcd."NAMELSAD_CD118_20", 'Unidentified') cd_name, 
        COALESCE("GEOID_CD118_20", '9999') cd_geoid, 
        s."NAME" state_name,
        s."GEOID" state_geoid
      FROM public.q7_zbp22detail z
      LEFT JOIN public.q6_zip_code_to_congressional_district zcd 
        ON z.zip = zcd."GEOID_ZCTA5_20"
      LEFT JOIN public.q6_cb_2018_us_state_500k s
        ON s."STUSPS" = z.stabbr
      WHERE z.naics LIKE '%${merged.breadth.naics}%'
      ) s
    WHERE (${stateQuery}) 
  `;

  const startQ7Coverage = Date.now();
  const q7CoverageSubset = (await client.query(queryQ7CoverageSubset)).rows;
  const q7CoverageTotal = (await client.query(queryQ7CoverageTotal)).rows;
  logger.info(`query7Coverage took ${Date.now() - startQ7Coverage}ms`);

  const q7Coverage = q7CoverageSubset[0]?.subset / q7CoverageTotal[0]?.total;

  return {
    q7Totals: {
      total_emp: q7Totals[0]?.total_emp,
      total_est: q7Totals[0]?.total_est,
    },
    q7Top10BySubUnit,
    q7BoundingBox,
    choroplethicData: {
      minEmp: q7ChoroplethData.min_emp,
      maxEmp: q7ChoroplethData.max_emp,
      minEst: q7ChoroplethData.min_est,
      maxEst: q7ChoroplethData.max_est,
    },
    chartInfo: {
      title: q7Totals[0]?.chart_info_title,
      info: `Calculated using data from ${
        q7Totals[0]?.zip_count
      } ZIP Codes within target geography in the year of 2022, this represents ${(
        q7Coverage * 100
      ).toFixed(2)}% of the total target geography`,
    },
    mapInfo: {
      zipCodes: q7Totals[0]?.zip_geojson,
      congressionalDistricts: q7Totals[0]?.cd_geojson,
    },
    coverage: q7Coverage,
  };
};

const queryService = async (query: string, searchResults?: SearchParams) => {
  const dashboardKey = matchDashboardKey(query);
  if (!dashboardKey) throw new Error("No dashboard matches this query");

  searchResults.queryKey = query;

  switch (dashboardKey) {
    case "q1":
      return { dashboardKey, data: await getQ1DashboardData(searchResults) };
    case "q2":
      return { dashboardKey, data: await getQ2DashboardData() };
    case "q3":
      return { dashboardKey, data: await getQ3DashboardData() };
    case "q4":
      return { dashboardKey, data: await getQ4DashboardData() };
    case "q6":
      return { dashboardKey, data: await getQ6DashboardData(searchResults) };
    case "q7":
      return { dashboardKey, data: await getQ7DashboardData(searchResults) };
    default:
      throw new Error("Unknown dashboard key");
  }
};

export default queryService;
