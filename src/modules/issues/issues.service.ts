import { IIssues } from "./issues.interface"
import { ISSUE_TYPE } from "../../types";
import { pool } from "../../db";
import { Request, Response } from "express";
import sendResponse from "../utils/response";


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

const getAllIssuesFromDB = async() => {
    const result = await pool.query(`
        SELECT * FROM issues
    `);

    const data = await Promise.all(
        result.rows.map( async(issue) => {
            const reporter = await pool.query(`
                SELECT id, name, role 
                FROM users
                WHERE id=$1    
            `, [issue.reporter_id]);

            const {reporter_id, ...rest} = issue;

            return {
                ...rest,
                reporter: reporter.rows[0]
            }
        })
    )

    return data;
}

const getSingleIssueFromDB = async(id:string) => {

    const result = await pool.query(`
       SELECT * FROM issues
       WHERE id=$1 
    `, [id]);

    if(result.rows.length === 0){
        throw new Error("Issue not found!");
    }

    const reporter = await pool.query(`
        SELECT id, name, role 
        FROM users
        WHERE id=$1 
    `, [result.rows[0].reporter_id]);   

    const {reporter_id, ...rest} = result.rows[0];

    const data = {
        ...rest,
        reporter: reporter.rows[0]
    }

    return data;
}

export const issuesService = {
    createIssuesIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB
}