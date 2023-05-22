const jwt = require('jsonwebtoken')
const config = require('../config/database')

//moddleware for after authentication
const authentication = async (req, res, next) => {

  let token = req.headers.authorization
  console.log(token)
  if (!token) {
    return res.status(400).send({
      is_error: true,
      message: 'sorry, You have no token',
    })
  } else {
    const varify = jwt.verify(token, config.SECRET)
    if (varify) {
      req.id = varify
      next()
    } else {
      return res.status(200).send({
        is_error: true,
        message: 'something went wrong',
      })
    }
  }

}
//for admin token varification
const adminmiddleware = async (req, res, next) => {
  const token = req.headers.authorization
  //   console.log(token)
  if (!token) {
    return res.status(200).send({
      is_error: true,
      message: 'sorry, You have no token'
    })
  } else {
    const varify = jwt.verify(token, config.SECRET)
    console.log(varify.role)
    if (varify.role === "admin") {
      next()
      return
    } else {
      return res.status(200).send({
        is_error: true,
        message: 'customer have not permission'
      })
    }
  }
}

//for customer middleware
const customermiddleware = async (req, res, next) => {
  const token = req.headers.authorization
  //   console.log(token)
  if (!token) {
    return res.status(200).send({
      is_error: true,
      message: 'sorry, You have no token'
    })
  } else {
    const varify = jwt.verify(token, config.SECRET)
    console.log(varify.role)
    if (varify.role === "customer") {
      req.id = varify
      console.log(req.id.id)
      next()
      return
    } else {
      return res.status(200).send({
        is_error: true,
        message: 'admin not rented and return movie '
      })
    }
  }
}



module.exports = {
  authentication,
  adminmiddleware,
  customermiddleware
}