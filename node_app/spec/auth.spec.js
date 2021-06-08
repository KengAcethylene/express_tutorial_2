const authRoute = require("../controller/auth");

const request = require('supertest');
const App = require('../../shared/utils/dbTest');
const Users = require('../data/user').users;

jest.setTimeout(20000);
describe("/auth", () => {
    describe("/register", () => {
        const url = '/register';
        it("basic case", async () => {
            App.mockDb('User', []);
            const res = await request(App(authRoute)).post(url).send({ name: "Acethylene", email: "Keng2120@gmail.com", password: "chanchai" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe("/login", () => {

    });

    describe("/logout", () => {

    });
});