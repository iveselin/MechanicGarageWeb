const indexController = require('../controllers/indexController');
const passport = require('passport');

describe('Test the indexController', () => {

    

    test('Index route', () => {
        const render = jest.fn();
        const res = {
            render,
        };
        indexController.index({}, res);
        expect(render.mock.calls).toHaveLength(1);
        expect(render.mock.calls[0][0]).toBe('index');
        expect(render.mock.calls[0][1]).toHaveProperty('title');
    });

    test('About route', () => {
        const render = jest.fn();
        const res = {
            render,
        };
        indexController.about_get({}, res);
        expect(render.mock.calls).toHaveLength(1);
        expect(render.mock.calls[0][0]).toBe('about');
        expect(render.mock.calls[0][1]).toHaveProperty('title');
    });

    test('Contac route', () => {
        const render = jest.fn();
        const res = {
            render,
        };
        indexController.contact_get({}, res);
        expect(render.mock.calls).toHaveLength(1);
        expect(render.mock.calls[0][0]).toBe('contact')
        expect(render.mock.calls[0][1]).toHaveProperty('title');
    });

    test('Login route - GET', () => {
        const render = jest.fn();
        const res = {
            render,
        };
        indexController.login_get({}, res);
        expect(render.mock.calls).toHaveLength(1);
        expect(render.mock.calls[0][0]).toBe('login')
        expect(render.mock.calls[0][1]).toHaveProperty('title');
    });
})

