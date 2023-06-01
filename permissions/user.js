const { Role } = require('../utils/authUtils')


const canGetUser = (role, id) => {
    return (
        role === Role.Admin ||
        id !== null
    )
}

module.exports = {
    canGetUser
}