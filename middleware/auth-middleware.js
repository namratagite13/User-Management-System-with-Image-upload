require('dotenv').config();
const jwt = require('jsonwebtoken');

// we require this middleware because  It ensures that only requests with a valid JSON Web Token (JWT) can proceed to the next function 
const authMiddleware = (req, res, next) =>{

    const authHeader = req.headers['authorization'];
    console.log(authHeader);

    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        })
    };

    //decode token
    try{
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedTokenInfo);


        req.userInfo = decodedTokenInfo;
        next()

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Access denied, No token provided!'
        })

    }
}

module.exports = authMiddleware;