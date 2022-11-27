const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME || 'online_store', // Название БД
    process.env.DB_USER || 'postgres', // Пользователь
    process.env.DB_PASSWORD || 'deathmonkey90', // ПАРОЛЬ
    {
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432
    }
)