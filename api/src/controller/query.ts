import queryService from "../service/query";
import { Request, Response } from "express";

const queryController = async (req: Request, res: Response) => {
  try {
    const { query, searchParams } = req.body;
    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'query' field" });
    }
    const result = await queryService(query, searchParams);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export default queryController;
