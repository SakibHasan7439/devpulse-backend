import express, { Application } from "express";
import cors from 'cors';

import { initDB } from "./db";
import globalErrorHandler from "./modules/middleware/globalErrorHandler";

const app: Application = express();

void initDB();

const corsOption = {
    origin: 'http://localhost:5000/'
}

app.use(express.json());
app.use(cors());


app.use(globalErrorHandler);
export default app;