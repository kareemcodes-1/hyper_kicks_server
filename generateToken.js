import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // 'lax' in development
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
}
