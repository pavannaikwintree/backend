import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';

const authentication = (req, res, next) =>{
    if(!req.cookies?.jwt){
        return res.json(new ApiResponse(false, {}, 'Unauthorized Access'));
    }
    try{
        const token = req?.cookies?.jwt;
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET); 
        if(!verifyToken){
            throw new ApplicationError("Invalid token", error.code || 400);
        }
        req.userId = verifyToken.userId;
        next();
    }catch(error){
        next(new ApplicationError(error.message, error.code || 400));
    }
}

export default authentication;