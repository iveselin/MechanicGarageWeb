const indexController = require('../controllers/indexController');
const passport = require('passport');

describe('Test of indexController', () => {

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

    test('Login route - POST', () => {
        const authenticateMock = jest.spyOn(passport, 'authenticate');
        const next = jest.fn()

        indexController.login_post({}, {}, next);

        expect(authenticateMock).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    test('Logout route', () => {
        const logout = jest.fn();
        const redirect = jest.fn();
        const req = {
            logout,
        }
        const res = {
            redirect,
        }

        indexController.logout_get(req, res);

        expect(logout.mock.calls).toHaveLength(1);
        expect(redirect.mock.calls).toHaveLength(1);
        expect(redirect.mock.calls[0][0]).toBe('/index');
    })
})

