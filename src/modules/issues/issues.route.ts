import { Router } from "express";
import { issuesController } from "./issues.controller";
import authMiddleware from "../middleware/authMiddleware";
import { USER_ROLE } from "../../types";

const route = Router();

route.post('/issues', authMiddleware(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssues);
route.get('/issues', issuesController.getAllIssues);
route.get('/issues/:id', issuesController.getSingleIssue);
route.get('/issues/:id', issuesController.updateIssues);
route.delete('/issues/:id', issuesController.deleteIssues);

export const IssueRoute = route;