import { Request, Response } from "express";
import sendResponse from "../utils/response";
import { issuesService } from "./issues.service";

const createIssues = async(req: Request, res: Response) => {
    try {
        const reporter_id = req.user.id;

        const payload = {
            ...req.body,
            reporter_id
        };

        const result = await issuesService.createIssuesIntoDB(payload);
         sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result
        });
        
    } catch (error:any) {
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: error.message
        })
    }
}

const getAllIssues = async(req: Request, res: Response) => {
    try {
        
    } catch (error:any) {
        sendResponse(res, {
            statusCode:500,
            success:false, 
            message: error.message,
        })
    }
}

const getSingleIssue = async(req: Request, res: Response) => {
    try {
        
    } catch (error:any) {
        sendResponse(res, {
            statusCode:500,
            success:false, 
            message: error.message,
        })
    }
}

const updateIssues = async(req: Request, res: Response) => {
    try {
        
    } catch (error:any) {
        sendResponse(res, {
            statusCode:500,
            success:false, 
            message: error.message,
        })
    }
}

const deleteIssues = async(req: Request, res: Response) => {
    try {
        
    } catch (error:any) {
        sendResponse(res, {
            statusCode:500,
            success:false, 
            message: error.message,
        })
    }
}

export const issuesController = {
    createIssues,
    getAllIssues,
    getSingleIssue,
    updateIssues,
    deleteIssues
}