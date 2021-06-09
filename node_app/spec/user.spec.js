const authRoute = require("../controller/auth");

const request = require('supertest');
const App = require('../../shared/utils/dbTest');
const Users = require('../data/user');

jest.setTimeout(20000);
describe("/app/auth", () => {
    describe("POST /register", () => {
        const url = '/register';
        it("register success", async () => {
            App.mockDb('User', []);
            const res = await request(App(authRoute)).post(url).send({ name: "Acethylene", email: "Keng2120@gmail.com", password: "chanchai" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        //* Missing in body
        it("missing name in body", async () => {
            const res = await request(App(authRoute)).post(url).send({ email: "Keng2120@gmail.com", password: "password" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Please add [name] [email] [password] in body");
            expect(res.body.data).toEqual({});
        });

        it("missing password in body", async () => {
            const res = await request(App(authRoute)).post(url).send({ name: "Chanchai", email: "Keng2120@gmail.com" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Please add [name] [email] [password] in body");
            expect(res.body.data).toEqual({});
        });

        it("missing email in body", async () => {
            const res = await request(App(authRoute)).post(url).send({ name: "Chanchai", password: "password" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Please add [name] [email] [password] in body");
            expect(res.body.data).toEqual({});
        });

        //* Existed email
        it("existed email", async () => {
            App.mockDb("User", Users);
            const res = await request(App(authRoute)).post(url).send({ name: "acethylene", email: "acethylene@gmail.com", password: "keng" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("email is already used");
            expect(res.body.data).toEqual({});
        });

        //* Validation in schema
        it("validation email", async () => {
            const res = await request(App(authRoute)).post(url).send({ name: "acethylene", email: "acethylene", password: "keng" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("User validation failed: email: acethylene validation error");
            expect(res.body.data).toEqual({});
        });

    });

    describe("POST /login", () => {
        const url = '/login';
        //* Success
        it("login success", async () => {
            App.mockDb("User", Users);
            const res = await request(App(authRoute)).post(url).send({ email: "acethylene@gmail.com", password: "keng" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        //* Login failed
        it("email does't match", async () => {
            App.mockDb("User", Users);
            const res = await request(App(authRoute)).post(url).send({ email: "keng@gmail.com", password: "keng" });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe("invalid email or password");
            expect(res.body.data).toEqual({});
        });

        it("password does't match", async () => {
            App.mockDb("User", Users);
            const res = await request(App(authRoute)).post(url).send({ email: "acethylene@gmail.com", password: "acethylene" });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe("invalid email or password");
            expect(res.body.data).toEqual({});
        });

        //* Missing in body
        it("missing password in body", async () => {
            const res = await request(App(authRoute)).post(url).send({ email: "acethylene@gmail.com" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Please add [email] [password] in body");
            expect(res.body.data).toEqual({});
        });

        it("missing email in body", async () => {
            const res = await request(App(authRoute)).post(url).send({ password: "password" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Please add [email] [password] in body");
            expect(res.body.data).toEqual({});
        });

        it("empty in body", async () => {
            const res = await request(App(authRoute)).post(url).send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Please add [email] [password] in body");
            expect(res.body.data).toEqual({});
        });

    });
});