import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { pool } from "../../db";
import { ROLES } from "../../types"
import config from '../../config';

const registerUserIntoDB = async(payload: {
    name: string,
    email: string,
    password: string,
    role: ROLES[];
})=> {

    const {name, email, password, role='contributor'} = payload;

    const user = await pool.query(`
       SELECT * FROM users
       WHERE email=$1 
    `,[email]);
        
    if(user.rows.length > 0) {
        throw new Error("Email is already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
       INSERT INTO users (name, email, password, role) 
       values ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at, updated_at
    `, [name, email, hashPassword, role]);

    return result.rows[0];
};

const loginUserIntoDB = async(payload: {email:string, password:string}) => {
      console.log("access token", config.jwt_secret);
    const {email, password} = payload;

    const result = await pool.query(`
       SELECT * FROM users
       WHERE email=$1 
    `, [email]);

    if(result.rows.length === 0){
        throw new Error("User not found!");
    }

    const user = result.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);

    if(!matchPassword){
        throw new Error("Invalid Password!");
    };

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
        expiresIn: '3d'
    });

    return {
        token: accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at
        }
    };
}

export const authService = {
    registerUserIntoDB,
    loginUserIntoDB
}