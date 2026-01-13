import express from "express";
import { createProblem, deleteProblem, getAllProblems, getAllSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controller.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";

const problemRoutes = express.Router();

problemRoutes.use(authMiddleware);

problemRoutes.get("/get-all-problem", getAllProblems);
problemRoutes.get("/get-problem/:id", getProblemById);
problemRoutes.get("/get-solved-problems/", getAllSolvedByUser);

problemRoutes.use(checkAdmin);

problemRoutes.post("/create-problem", createProblem);
problemRoutes.put("/update-problem/:id", updateProblem);
problemRoutes.delete("/delete-problem/:id", deleteProblem);

// problemRoutes.post(
//   "/create-problem",
//   authMiddleware,
//   checkAdmin,
//   createProblem
// );
// problemRoutes.get("/get-all-problem", authMiddleware, getAllProblems);
// problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);
// problemRoutes.put("/update-problem/:id", authMiddleware,checkAdmin, updateProblem);
// problemRoutes.delete("/delete-problem/:id", authMiddleware, checkAdmin,deleteProblem);

export default problemRoutes;
