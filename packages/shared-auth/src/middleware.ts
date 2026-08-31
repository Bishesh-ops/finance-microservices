import type {Request, Response, NextFunction} from "express";
import {verifyToken} from "./jwt.js";
import {fromThrowable} from "neverthrow";

export interface AuthedRequest extends Request{
    user?: {user_id: string, email: string};
}

const safeVerifyToken = fromThrowable(verifyToken, () => new Error("invalid or expired token"));

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({error: "missing or invalid authorization header"});
    }

    const token = authHeader.slice(7);

    const result = safeVerifyToken(token);

    if(result.isErr()){
        return res.status(401).json({error: result.error.message});
    }

    req.user = result.value!;
    next();

}