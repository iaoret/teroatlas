import { Router } from "express";
import queryController from "../controller/query";

const router = Router();

router.get("/", queryController);

export default router;
