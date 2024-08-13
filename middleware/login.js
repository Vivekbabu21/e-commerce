const jwt = require('jsonwebtoken');


async function login(req,res,next){
    // const token = req.header('x-token');
    const token = req.cookies['x-token'] || req.header('x-token');
    if(!token) return res.status(401).send('Access deied.No token provided.');

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;    

        

        next();
    }
    catch(ex){
        console.error('failed:',ex.message);
        res.status(400).send('Invalid token');
    }
    
    
}

module.exports = login;