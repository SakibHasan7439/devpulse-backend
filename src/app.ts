import express, { Application, Request, Response } from "express";
import cors from 'cors';

import { initDB } from "./db";
import globalErrorHandler from "./modules/middleware/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";

const app: Application = express();

void initDB();

const corsOption = {
    origin: 'http://localhost:5000/'
}

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));

// app.get('/user', (req: Request, res: Response) => {
//   res.status(200).json({
//     "message": "Express server is running!",
//     "author": "Sakib Hasan"
//   })
// })


app.use('/api/auth', authRouter);

app.use(globalErrorHandler);
export default app;