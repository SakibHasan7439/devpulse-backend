import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { ROLES } from "../../types";
import sendResponse from "../utils/response";
import config from "../../config";
import { pool } from "../../db";

const authMiddleware = (...roles: ROLES[]) => {
    return async(req: Request, res:Response, next:NextFunction) => {
        try {
            const token = req.headers.authorization;
            console.log({token});

            if(!token){
                sendResponse(res,{
                    statusCode: 201,
                    success: false,
                    message: 'Unauthorized access!!'
                    } 
                )
            }

            const decode = jwt.verify(token as string, config.jwt_secret as string) as JwtPayload;
            const userData = await pool.query(`
                SELECT * FROM users
                WHERE email=$1
            `, [decode.email]);

            const user = userData.rows[0];

            if(userData.rows.length === 0){
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'User not found!'
                })
            }

            if(roles.length && !roles.includes(user.role)){
                sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: 'Forbidden user!',
                })
            }

            req.user = decode;
            next();

        } catch (error) {
            next(error);
        }
        console.log(roles);
    }
}

export default authMiddleware;