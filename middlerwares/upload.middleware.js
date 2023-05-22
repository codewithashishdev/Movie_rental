const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`)
  }
})

var uploadimage = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).single('movie_title');

module.exports = {
  uploadimage
}