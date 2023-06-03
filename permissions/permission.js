const roles = {
  admin: ['create', 'read', 'update', 'delete','add-movie','viewall-movie','search-movie','edit-movie','delete-movie','view-movie'],
  customer: ['read', 'update','viewall-movie','search-movie'],
}
//role permssion 
module.exports = {
  roles
}