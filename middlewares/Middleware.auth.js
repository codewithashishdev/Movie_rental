const jwt = require('jsonwebtoken')
const config = require('../config/database')
const ac = require('../permissions/permission');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model')
const Logger = require('../controllers/logger.controller')


//moddleware for after authentication
const authentication = async (req, res, next) => {

  let token = req.headers.authorization
  if (!token) {
    Logger.authLogger.log('error', 'Not Token "authentication Middleware"')
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
      Logger.authLogger.log('error', 'Middlware "authentication Middleware"')
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
  if (!token) {
    Logger.authLogger.log('error', 'Not Token "Admin-Authentication Middleware"')
    return res.status(200).send({
      is_error: true,
      message: 'sorry, You have no token'
    })
  } else {
    const varify = jwt.verify(token, config.SECRET)
    if (varify.role === "admin") {
      next()
      return
    } else {
      Logger.authLogger.log('error', 'Not Allowed "Admin-Authentication Middleware"')
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
  if (!token) {
    Logger.authLogger.log('error', 'Not Token "Customer-Authentication Middleware"')
    return res.status(200).send({
      is_error: true,
      message: 'sorry, You have no token'
    })
  } else {
    const varify = jwt.verify(token, config.SECRET)
    if (varify.role === "customer") {
      req.id = varify
      next()
      return
    } else {
      Logger.authLogger.log('error', 'Not Allowed "Customer-Authentication Middleware"')
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
    if (varify.role !== role) {
      return res.status(401).send('Not Allowed')
    }
    next();
  }
}

const userpermission = (req, res, next) => {
  let condtion = canGetUser(req.id.role, req.id.id)
  if (!(condtion)) {
    res.status(401).send('not allowed')
  } else {
    next()
  }
}

// Authorization middleware
const permission = (requiredPermission) => {
  return async (req, res, next) => {
    const token = req.headers.authorization
    const varify = jwt.verify(token, config.SECRET)
    req.id = varify
    const userRole = req.id.role;

    const role = await Role.findOne({
      where: {
        role_name: userRole
      }
    })
    let permisions = role.permission_id;
    let permission_name = []
    for (let index = 0; index < permisions.length; index++) {
      const element = permisions[index];
      const permision = await Permission.findOne({
        where: {
          permission_id: element
        }
      })
      permission_name.push(permision.permissions_name)
    }
    if (userRole && permission_name.includes(requiredPermission)) {
      next();
    }
    else {
      Logger.authLogger.log('error', 'Not Permissioned "Permission Middleware"')
      res.status(403).send({
        error: 'Insufficient permissions',
        message: 'Not allowed access deniel'
      });
    }
  };
};


module.exports = {
  authentication,
  adminmiddleware,
  customermiddleware,
  isAuthenticated,
  authRole,
  userpermission,
  permission
}