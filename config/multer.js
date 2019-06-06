const Multer = require('multer'); //aquí llamamos a la librería multer
const mimetypes = ['image/png', 'image/jpg', 'image/jpeg'];
const uploadPics = Multer({ //aquí pasamos la configuración de dicha librería
    storage: Multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, './public/uploads/profilePics'); // aquí especificas el directorio donde se guardan las imagenes de perfil
        },
        filename: (req, file, callback) => {
            callback(null, Date.now() + '-' + file.originalname); // aquí especificas el nombre del archivo imagen guardado
        },
    }),
    fileFilter: (req, file, callback) => {
        if (mimetypes.includes(file.mimetype)) { //aquí compruebo que mimetype del archivo que me estan enviando sea el que yo tenga recogido
            callback(null, true)
        } else {
            callback(null, false)
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 } // limitamos el tamaño del archivo
});

module.exports = uploadPics;