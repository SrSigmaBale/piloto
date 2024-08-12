const { verify, decode } = require('jsonwebtoken')
const secret = require('../config/secret.js')

module.exports = async (req , res, next) => {
    const token = req.headers.authorization
    if(!token) {
        const error = new Error('Access Token Nao Informado')
        error.status = 401
        return next(error)
        // return res.status(401).json('access token nao informado')
    }

    const [, accessToken] = token.split(' ')
    try {
        verify(accessToken, secret.secret)
        const sessionId = await decode(accessToken)
        req.sessionId = sessionId
        
        return next()
    } 
    catch (error) {
        next(error)
    }
}