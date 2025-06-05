import { Request, Response } from "express";
import suggestionsService from "../service/suggestions";

const suggestionsController = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'query' parameter" });
    }
    const result = await suggestionsService(query);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export default suggestionsController;
