import { Router } from "express";
import queryController from "../controller/query";

const router = Router();

router.post("/", queryController);

export default router;
