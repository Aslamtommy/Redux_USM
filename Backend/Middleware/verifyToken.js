const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
   

    // Get token from the 'Authorization' header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log('No token provided.'); // Debug log
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Debug: Log the token before verification
 
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

       

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
       
            return res.status(401).json({ error: 'Token has expired. Please log in again.' });
        }
        console.error('Token verification error:', error); // Log the error for debugging
        return res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = verifyToken;
