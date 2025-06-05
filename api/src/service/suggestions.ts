import { usStates } from "../lib";

const dashQ1Key = "dc economic data congressional district";
const dashQ2Key =
  "new york manufacturing economic data 1st congressional district";
const dashQ3Key = "dc jobs per housing unit stats ward 1";
const dashQ4Key = "nyc lowest gross income per full market value borough block";
const dashQ6Keys = usStates.map(
  (e) => `${e} economic data congressional district`
);

function getSuggestions(query: string): string[] {
  const suggestions: string[] = [];
  const lower = query.toLowerCase();

  if (dashQ1Key.includes(lower) || lower === "query 1") {
    suggestions.push(dashQ1Key);
  }
  if (dashQ2Key.includes(lower) || lower === "query 2") {
    suggestions.push(dashQ2Key);
  }
  if (dashQ3Key.includes(lower) || lower === "query 3") {
    suggestions.push(dashQ3Key);
  }
  if (dashQ4Key.includes(lower) || lower === "query 4") {
    suggestions.push(dashQ4Key);
  }
  if (dashQ6Keys.some((e) => e.includes(lower)) || lower === "query 6") {
    suggestions.push(...dashQ6Keys);
  }
  return suggestions;
}

const suggestionsService = async (query: string): Promise<string[]> => {
  return getSuggestions(query);
};

export default suggestionsService;
