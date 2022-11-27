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
        findOne(opts) {
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
describe('userController registration', function () {
    it('with empty email value', async function () {
        const response = await request(app)
            .post('/api/user/registration')
            .send({
                "email": "",
                "password": "1111"
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(404);
        expect(response.body.message).to.be.equal('Поле email и password не должны быть пустыми');
    });

    it('with empty password', async function () {
        const response = await request(app)
            .post('/api/user/registration')
            .send({
                "email": "Peter_Parker@gmail.com",
                "password": ""
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(404);
        expect(response.body.message).to.be.equal('Поле email и password не должны быть пустыми');
    });


    it('for user which is already exist', async function () {
        const response = await request(app)
            .post('/api/user/registration')
            .send({
                "email": "Peter_Parker@gmail.com",
                "password": "11111111111"
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(404);
        expect(response.body.message).to.be.equal('Пользователь с таким email уже существует');
    });

    it('a new user', async function () {
        const response = await request(app)
            .post('/api/user/registration')
            .send({
                "email": "Brock_Venom@gmail.com",
                "password": "2222222222"
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.token).to.not.be.empty;
    });
});