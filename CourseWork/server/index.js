require('dotenv').config();
const express = require('express');
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileupload = require('express-fileupload')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const PORT = process.env.PORT || 5000;

function createApp(dbModels) {
    global.models = dbModels ? dbModels : models;
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.resolve(__dirname, 'static')));
    app.use(fileupload({}));
    const router = require('./routes/index')
    app.use('/api', router);

//Обработка ошибок, последний Middleware
    app.use(errorHandler)
    return app;
}

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        createApp().listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

(async () => {
    await start();
})();

module.exports.createApp = createApp;