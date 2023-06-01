const jwt = require('jsonwebtoken')
const config = require('../config/database')
const { canGetUser } = require('../permissions/user')


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

//if user not auth
const isAuthenticated = (req, res, next) => {
  if (req.headers.authorization == null) {
    res.status(403).send('you need to sign in')
  }
  next()
};

//for role 

const authRole = (role) => {
  return async (req, res, next) => {
    const token = req.headers.authorization

    const varify = jwt.verify(token, config.SECRET)
    req.user = varify
    console.log(varify)
    if (varify.role !== role) {
      return res.status(401).send('Not Allowed')
    }
    next();
  }
}

const userpermission = (req, res, next) => {
  // console.log('=========', req.id)
  let condtion = canGetUser(req.id.role, req.id.id)
  // console.log('if condition', !condtion)
  if (!(condtion)) {
    res.status(401).send('not allowed')
  } else {
    next()
  }
}


module.exports = {
  authentication,
  adminmiddleware,
  customermiddleware,
  isAuthenticated,
  authRole,
  userpermission
}