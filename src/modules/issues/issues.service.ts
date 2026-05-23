import { IIssues } from "./issues.interface"
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

export const issuesService = {
    createIssuesIntoDB,
    getAllIssuesFromDB
}