import { Request, Response } from "express"
import { IIssues } from "./issues.interface"
import sendResponse from "../utils/response"
import { ISSUE_TYPE } from "../../types";
import { pool } from "../../db";


const createIssuesIntoDB = async(payload: IIssues) => {
    const { title, description, type, reporter_id } = payload;

    if(type !== ISSUE_TYPE.bug && type !== ISSUE_TYPE.feature) {
        throw new Error("Issue type is invalid!");
    }

    const result = await pool.query(`
       INSERT INTO issues (title, description, type, reporter_id)
       VALUES($1, $2, $3, $4)
       RETURNING *
    `,[ title, description, type, reporter_id]);

    return result.rows[0];
}


export const issuesService = {
    createIssuesIntoDB
}