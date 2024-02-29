const { unauthorizedResponse } = require("../helper/formatResponse")
const { verify } = require("../lib/jwt")

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    const verified = verify(token)
    const endpoint = req.originalUrl
    if (verified && (verified.exp > Date.now() / 1000)) {
        if (verified.isAdmin && endpoint === '/api/v1/items/') {
            next()
        } else {
            unauthorizedResponse(res)
        }
    } else {
        unauthorizedResponse(res)
    }
}

module.exports = authMiddleware