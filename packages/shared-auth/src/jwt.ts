import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const signToken = (payload: {user_id: string, email: string}) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as {user_id: string, email: string};
    } catch (error) {
        return null;
    }
};

export { signToken, verifyToken };