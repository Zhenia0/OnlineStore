const request = require('supertest');
const {expect} = require('chai');
const createApp = require('../index').createApp;
const {Device} = require('../models/models');
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, role) =>{
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

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
describe('authMiddleware', function () {
    it('no token', async function () {
        const response = await request(app)
            .get('/api/user/auth')
        expect(response.statusCode).to.be.equal(401);
        expect(response.body.message).to.be.equal('Не авторизован');
    });

    it('invalid token', async function () {
        const response = await request(app)
            .get('/api/user/auth')
            .set('authorization', 'Bearer 12345')
        expect(response.statusCode).to.be.equal(401);
        expect(response.body.message).to.be.equal('Не авторизован');
    });

    it('valid token', async function () {
        const token = generateJwt(6, 'Peter_Parker@gmail.com', 'ADMIN')
        const response = await request(app)
            .get('/api/user/auth')
            .set('authorization', `Bearer ${token}`)
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.token).to.not.be.empty;
    });
});