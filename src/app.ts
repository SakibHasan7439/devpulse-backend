import express, { Application, Request, Response } from "express";
import cors from 'cors';

import { initDB } from "./db";
import globalErrorHandler from "./modules/middleware/globalErrorHandler";
import { authRoute, authRouter } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import { IssueRoute } from "./modules/issues/issues.route";

const app: Application = express();

void initDB();

const corsOption = {
    origin: 'http://localhost:5000/'
}

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Express server is running!",
    "author": "Sakib Hasan"
  })
})


app.use('/api/auth', authRoute);
app.use('/api', IssueRoute);

app.use(globalErrorHandler);
export default app;