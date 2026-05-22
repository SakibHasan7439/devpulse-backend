import { Request, Response } from "express";
import sendResponse from "../utils/response";
import { authService } from "./auth.service";


const registerUser = async(req:Request, res:Response) => {
    try {
        const result = await authService.registerUserIntoDB(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'User created successfully',
            data: result
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            data: error
        })
    }
}

const loginUser = async(req:Request, res:Response) => {
    try {
        const result = await authService.loginUserIntoDB(req.body);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User logged in successfully",
            data: result
        })

    } catch (error: any) {
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: error.message
        }

        )
    }
}

export const authController = {
    registerUser,
    loginUser
}