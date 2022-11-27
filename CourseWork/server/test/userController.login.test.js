const request = require('supertest');
const {expect} = require('chai');
const {Device} = require('../models/models');

const createApp = require('../index').createApp;

const databaseMock = {
    User: {
        create(email) {
            return {id: 1, email: email, role: 'ADMIN'}
        },
        findOne(opts) {
            if (opts.where.email === 'Peter_Parker@gmail.com') {
                return {id: 6, email: 'Peter_Parker@gmail.com', password: '$2b$05$y9W7cvBuo808Zit2wQ/SK.seuOSTwPhZoF4eFTsQi.NkOG3rDdfUa'};
            }
        }
    },
    Basket: {
        create(opts) {
        },
        findOne() {
            return {id: 6};
        }
    },
    Type: {
        create(type){
            return {name: type.name, id: 123}
        }
    },
    Device
}
const app = createApp(databaseMock);
describe('userController login', function () {
    it('with not existing user', async function () {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                "email": "IdontExist@gmail.com",
                "password": "1111"
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(500);
        expect(response.body.message).to.be.equal('Пользователь не найден');
    });

    it('with existing user but wrong password', async function () {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                "email": "Peter_Parker@gmail.com",
                "password": "123456789"
            })
            .set('Accept', 'application/json');

        expect(response.statusCode).to.be.equal(500);
        expect(response.body.message).to.be.equal('Указан неверный пароль');
    });

    it('with valid credentials', async function () {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                "email": "Peter_Parker@gmail.com",
                "password": "1111"
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.token).to.not.be.empty;
    });

    it('with invalid email', async function () {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                "email": "Peter_Parker",
                "password": "1111"
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(404);
        expect(response.body.message).to.be.equal('Некорректный email. Проверьте правильность ввода email');
    });
});
