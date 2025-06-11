import client from "./db";

const dashQ1Key = "dc economic data congressional district";
const dashQ2Key =
  "new york manufacturing economic data 1st congressional district";
const dashQ3Key = "dc jobs per housing unit stats ward 1";
const dashQ4Key = "nyc lowest gross income per full market value borough block";

// Suggestion cache
interface SuggestionCache {
  static: string[];
  dynamic: string[];
}

const suggestionCache: SuggestionCache = {
  static: [dashQ1Key, dashQ2Key, dashQ3Key, dashQ4Key],
  dynamic: [],
};

// Loader for all suggestions (call on startup)
export async function loadSuggestions() {
  // Example: load dynamic suggestions from DB (was Q6)
  const query = `SELECT 
    state_name || ' ' || cd_name || ' economic data' q6_suggestions
    , state_name || ' ' || cd_name || ' manufacturing data' q7_suggestions
  FROM (
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
  WHERE cd_geoid <> '9999'
  GROUP BY cd_geoid, cd_name, state_name, state_geoid, state_abbr
  ORDER BY state_name, cd_name`;

  const suggestions = await client.query(query);
  suggestions.rows.map((e) => {
    suggestionCache.dynamic.push(e.q6_suggestions.toLowerCase());
    suggestionCache.dynamic.push(e.q7_suggestions.toLowerCase());
  });
}

function getSuggestions(query: string): string[] {
  const suggestions: string[] = [];
  const lower = query.toLowerCase();

  // Static suggestions
  if (suggestionCache.static[0].includes(lower) || lower === "query 1") {
    suggestions.push(suggestionCache.static[0]);
  }
  if (suggestionCache.static[1].includes(lower) || lower === "query 2") {
    suggestions.push(suggestionCache.static[1]);
  }
  if (suggestionCache.static[2].includes(lower) || lower === "query 3") {
    suggestions.push(suggestionCache.static[2]);
  }
  if (suggestionCache.static[3].includes(lower) || lower === "query 4") {
    suggestions.push(suggestionCache.static[3]);
  }
  // Dynamic suggestions
  if (
    suggestionCache.dynamic.some((e) => e.includes(lower)) ||
    lower === "query 6"
  ) {
    suggestions.push(
      ...suggestionCache.dynamic.filter((e) => e.includes(lower))
    );
  }
  return suggestions;
}

const suggestionsService = async (query: string): Promise<string[]> => {
  return getSuggestions(query);
};

export default suggestionsService;
