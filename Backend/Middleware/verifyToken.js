const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]

  if (!token) {
    console.log("No token provided") 
    return res.status(401).json({ error: "Access denied. No token provided" })
  }

  try {
    console.log("hello")

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded

    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token has expired. Please log in again" })
    }
    console.error("Token verification error:", error)
    return res.status(400).json({ error: "Invalid token" })
  }
}

module.exports = verifyToken
