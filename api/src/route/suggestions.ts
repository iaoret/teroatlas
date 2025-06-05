import { Router } from "express";
import suggestionsController from "../controller/suggestions";

const router = Router();

router.get("/", suggestionsController);

export default router;
