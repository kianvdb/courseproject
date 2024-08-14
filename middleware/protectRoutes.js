import jwt from 'jsonwebtoken';
import User from '../model/auth.model.js';

export const protectRoutes = async (request, response, next) => {
    try {
        const token = request.cookies.jwt;
        if (!token) {
            return response.status(401).send({ error: "Not authorized" });
        }

        console.log('Token:', token);

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decode); 

        if (!decode || !decode._id) {
            return response.status(401).send({ error: "Invalid Token" });
        }

        const user = await User.findById(decode._id); 
        console.log('User:', user); 
        if (!user) {
            return response.status(401).send({ error: "User not found" });
        }
        
        request.user = user;
        next();
    } catch (error) {
        return response.status(500).send(`Error in middleware: ${error}`);
    }
};
