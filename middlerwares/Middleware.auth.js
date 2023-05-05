const jwt = require('jsonwebtoken')
const config = require('../config/database')
//moddleware for after authentication
const authentication = async(req, res, next) => {

    let token = req.headers.authorization
    // console.log('middlerware is working')
    if (!token) {
        return res.status(400).send({
            is_error: true,
            message: 'token require',
        })
    } else {
        //verify token
        const decodes = jwt.verify(token, config.SECRET,
            (err) => {
                if (err) { () => console.log(err) }
            })
        req.id = decodes
        next()
    }

}

const adminauthentication = async (req, res, next) => {
try {
    console.log('+++++++++++++++++++',value)
    console.log('+++++++++++++++++++',req)

    let token = req.headers.authorization
    console.log('+++++++++++++++++++token',token)

    if (!token) {
        return res.status(400).send({
            is_error: true,
            message: 'token require',
        })
    } else {
    console.log('++++++++++++++++else')

        const decode = await jwt.verify(token, config.SECRET)
        console.log(decode)
        if (decode, decode.role === value) {
             res.send({
                role :value
            })
            next()
        }
    }
} catch (error) {
    console.log(error)
    return res.status(401).send({
        is_error:true,
        error: error 
    })
}
}

module.exports = {
    authentication,
    adminauthentication
}