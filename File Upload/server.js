const express = require('express');
const app = express();
const fileSystem = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, `${__dirname}/../public/images/`);
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({storage: storage});

app.get('/index.html', (request, response) => {
    response.sendFile(`${__dirname}/index.html`);
});

app.post('/file_upload', upload.single('file'), (request, response) => {
    const file = request.file;
    console.log("File name: ", file.originalname);
    console.log("File path: ", file.path);
    console.log("File type: ", file.mimetype);
    console.log(request.cookies);
    
    let filePath = `${__dirname}/../public/images/${file.originalname}`;
    let result;

    fileSystem.readFile(file.path, (error, data) => {
        fileSystem.writeFile(filePath, data, (error) => {
            if (error) {
                console.error(error);
            } else {
                result = {
                    message: 'File uploaded successfully',
                    filename: file.originalname
                }
            }

            console.log("result: ", result);
            response.end();
        });
    });
});


const server = app.listen(8081, '127.0.0.1', () => {
    let serverAddress = server.address();
    let host = serverAddress.address;
    let port = serverAddress.port;

    console.log(`Example app listening at http://${host}:${port}`);
});