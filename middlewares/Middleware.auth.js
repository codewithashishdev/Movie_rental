const jwt = require('jsonwebtoken')
const config = require('../config/database')
const ac = require('../permissions/permission');
// const { roles } = require('../permissions/permission')
const Role = require('../models/role.model');
const Permission = require('../models/permission.model')


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

// const authorize = (permission) => {
//   return (req, res, next) => {
//     const { user } = req;
//     const permissionAllowed = ac.can(user.role)[permission](req.params.resource);
//     if (!permissionAllowed.granted) {
//       return res.status(403).json({ error: 'Unauthorized access' });
//     }
//     next();
//   };
// }


// Authorization middleware
const permission = (requiredPermission) => {
  return async (req, res, next) => {
    console.log('this')

    const token = req.headers.authorization
    // console.log(token)
    const varify = jwt.verify(token, config.SECRET)
    // console.log(varify)
    req.id = varify
    const userRole = req.id.role;

    const role = await Role.findOne({
      where: {
        role_name: userRole
      }
    })
    let permisions = role.permission_id;
    let permission_name = []
    // console.log(permisions)
    for (let index = 0; index < permisions.length; index++) {
      const element = permisions[index];
      console.log(element)
      const permision = await Permission.findOne({
        where: {
          permission_id: element
        }
      })
      // console.log(permision.permissions_name)
      permission_name.push(permision.permissions_name)
    }
    // console.log(permission_name)
    // const hasRequiredPermissions = requiredPermission.every(permission =>
    //   userPermissions.includes(permission)
    // );
    if (userRole && permission_name.includes(requiredPermission)) {
      next();
    }

    // return console.log('')
    // const permission = await Permission.findAll({
    //   where: {
    //     permission_id: role.permission_id
    //   }
    // })
    // return console.log(permission.permissions_name)
    // console.log(permission.permissions_name == requiredPermission)
    // //userRole and requirepermission
    // if (userRole && (permission.permissions_name == requiredPermission)) {
    else {
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