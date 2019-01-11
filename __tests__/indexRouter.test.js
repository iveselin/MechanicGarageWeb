const app = require('../app');
const request = require('supertest');
const User = require('../model/User');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Testing public routes in index router - no DB required', () => {

    test('Index page - it should respond to GET', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text.includes('<title>Garage homepage</title>')).toBeTruthy();
    })

    test('About page - it should respond to GET', async () => {
        const response = await request(app).get('/about');
        expect(response.statusCode).toBe(200);
        expect(response.text.includes('<title>Basic info</title>')).toBeTruthy();
    })

    test('Contact page - it should respond to GET', async () => {
        const response = await request(app).get('/contact');
        expect(response.statusCode).toBe(200);
        expect(response.text.includes('<title>Contact info</title>')).toBeTruthy();
    })

    test('Login page - it should respond to GET', async () => {
        const response = await request(app).get('/login');
        expect(response.statusCode).toBe(200);
        expect(response.text.includes('<title>Garage sign-in page</title>')).toBeTruthy();
        expect(response.text.includes('<form')).toBeTruthy();
    })

});

describe('Testing public routes in index router - with temp DB', () => {
    let mongodb;
    let agent;
    let cookie;

    beforeAll(async () => {
        mongodb = new MongoMemoryServer();
        await mongoose.connect(await mongodb.getConnectionString(), { useNewUrlParser: true });
        await mongoose.connection.db.dropDatabase();
        await User.register(new User({ username: 'test@email.hr' }), 'password');
    })

    afterAll(async () => {
        mongoose.disconnect();
        mongodb.stop();
    })

    test('Login page - it should respond to POST - good credentials', async () => {
        const response = await request(app).post('/login')
            .send({
                username: 'test@email.hr',
                password: 'password'
            });
        expect(response.redirect.valueOf()).toBeTruthy();
        expect(response.header['location'].includes('/administration')).toBeTruthy();
    })

    test('Login page - it should respond to POST - bad credentials', async () => {
        const response = await request(app).post('/login')
            .send({
                username: 'wrong@email.hr',
                password: 'wrong'
            });
        expect(response.statusCode).toBe(302);
        expect(response.redirect.valueOf()).toBeTruthy();
        expect(response.header['location'].includes('/login')).toBeTruthy();
    })

    function createLoginCookie() {
        agent = request.agent(app);
        return agent.post('/login')
            .send({
                username: 'test@email.hr',
                password: 'password'
            })
            .expect(302)
            .then((res) => {
                const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
                cookie = cookies.join(';');
            });
    }

    test('Logout call - it should respond to GET', async () => {
        await createLoginCookie();

        const response = await request(app).get('/logout').set('Cookie', cookie);

        expect(response.statusCode).toBe(302);
        expect(response.header['user']).toBeUndefined();
        expect(response.header['location'].includes('/index')).toBeTruthy();

    })
})

