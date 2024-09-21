require('dotenv').config();
// const secret = require('../config/secret.js')
const { compare, hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const secret = {
    secret: process.env.SECRET,
    password: process.env.PASSWORD
}

async function security(data) {
    const senhasIguais = await compare(data, secret.password)
    if(!senhasIguais) {
        const error = new Error('Usuario ou senha invalido')
        error.status = 401
        return error
    }

    const uuid = uuidv4()
    const accessToken = sign({
        sessionId: uuid
    }, secret.secret, {
        expiresIn: 86400
    })

    return { accessToken }
}

module.exports = security