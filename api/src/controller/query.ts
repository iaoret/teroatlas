import queryService from "../service/query";
import { Request, Response } from "express";

const queryController = async (req: Request, res: Response) => {
  const query = req.body.query;
  const result = await queryService(query);
  res.json(result);
};

export default queryController;
