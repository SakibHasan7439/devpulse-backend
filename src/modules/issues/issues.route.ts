import { Router } from "express";
import { issuesController } from "./issues.controller";
import authMiddleware from "../middleware/authMiddleware";
import { USER_ROLE } from "../../types";

const route = Router();

// protected routes
route.post('/issues', authMiddleware(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssues);
route.get('/issues/:id', authMiddleware(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.updateIssues);
route.delete('/issues/:id',authMiddleware(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.deleteIssues);

// public routes
route.get('/issues', issuesController.getAllIssues);
route.get('/issues/:id', issuesController.getSingleIssue);

export const IssueRoute = route;