import jwt from 'jsonwebtoken';

export const generateTokenandSetCookie = (_id, response) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });
    response.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
};
