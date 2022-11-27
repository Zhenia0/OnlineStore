const request = require('supertest');
const {expect} = require('chai');
const createApp = require('../index').createApp;
const {Device} = require('../models/models');
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, role) => {
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
describe('checkRoleMiddleware in combination with type creation', function () {
    it('no token', async function () {
        const response = await request(app)
            .post('/api/type')
            .send({
                "name": "Some Type",
            })
            .set('Accept', 'application/json');

        expect(response.statusCode).to.be.equal(401);
        expect(response.body.message).to.be.equal('Не авторизован');
    });

    it('options request', async function () {
        const response = await request(app)
            .options('/api/type');

        expect(response.statusCode).to.be.equal(204);
    });

    it('non admin token', async function () {
        const tokenForNonAdmin = generateJwt(6, 'Peter_Parker@gmail.com', 'USER')
        const response = await request(app)
            .post('/api/type')
            .send({
                "name": "Some Type",
            })
            .set('authorization', `Bearer ${tokenForNonAdmin}`)
            .set('Accept', 'application/json');

        expect(response.statusCode).to.be.equal(403);
        expect(response.body.message).to.be.equal('Нет доступа');
    });

    it('invalid token', async function () {
        const response = await request(app)
            .post('/api/type')
            .send({
                "name": "Some Type",
            })
            .set('authorization', `Bearer 123`)
            .set('Accept', 'application/json');

        expect(response.statusCode).to.be.equal(401);
        expect(response.body.message).to.be.equal('Не авторизован');
    });

    it('add type with admin token', async function () {
        const adminToken = generateJwt(6, 'Peter_Parker@gmail.com', 'ADMIN')
        const response = await request(app)
            .post('/api/type')
            .send({
                "name": "Some Type",
            })
            .set('authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(response.statusCode).to.be.equal(200);
        expect(response.body.name).to.be.equal('Some Type');
    });
});