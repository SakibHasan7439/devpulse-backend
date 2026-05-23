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

const updateIssueIntoDB = async(
    id:string,
    payload: IIssues,
    requester: {id: string, role: string}
    ) => {
    
        const {title, description, type} = payload;
        const getIssue = await pool.query(`
            SELECT * FROM issues
            WHERE id=$1
        `, [id]);

        if(getIssue.rows.length === 0){
            throw new Error("Issue not found!");
        }

        const issue = getIssue.rows[0];

        if(requester.role === "contributor"){
            if(issue.reporter_id !== requester.id){
                throw new Error("Unauthorized Access!");
            }
            if(issue.status !== "open"){
                throw new Error("Updated Cannot be done for this issue!");
            }
        }

        const result = await pool.query(`
           UPDATE issues
           SET title = COALESCE($1, title),
               description = COALESCE($2, description),
               type = COALESCE($3, type),
               updated_at = NOW()
            WHERE id = $4
            RETURNING *
        `, [title, description, type,id]);

        return result;
}

const deleteIssueFromDB = async(id:string) => {
    const result = await pool.query(`
       DELETE FROM issues
       WHERE id=$1 
    `, [id]);

    return result;
}

export const issuesService = {
    createIssuesIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueIntoDB,
    deleteIssueFromDB
}