const catchObje = {
    is_error: true,
    statusCode: 500,
    message: 'Internal server error'
}
const useralready = {
    is_error: false,
    statusCode: 404,
    message: 'User already sign up',
    data: null
}

const Role = {
    Customer :"customer",
    Admin:"admin"
}

module.exports = {
    catchObje,
    useralready,
    Role
}