const noauthRoute = require('../controller/no_auth');

const request = require('supertest');
const App = require('../../shared/utils/dbTest');
const Todos = require('../data/todo');

jest.setTimeout(30000);

describe("/app/no_auth", () => {
    describe("GET /todos", () => {
        const url = '/todos';
        it('getAll success', async () => {
            App.mockDb('Todo', Todos);
            const res = await request(App(noauthRoute)).get(url);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(2);
        });
    });

    describe("POST /todos", () => {
        const url = '/todos';
        it('create todo success', async () => {
            const res = await request(App(noauthRoute)).post(url).send({ title: "Do Assignment" });
            expect(res.status).toBe(201);
            expect(res.body.data.order).toBe(3);
            expect(res.body.data.title).toBe("Do Assignment");
        });

        it("check auto increment of order", async () => {
            const res = await request(App(noauthRoute)).post(url).send({ title: "Do Assignment" });
            expect(res.status).toBe(201);
            expect(res.body.data.order).toBe(4);
            expect(res.body.data.title).toBe("Do Assignment");
        });

        // it('status 400', async () => {
        //     const res = await request(App(noauthRoute)).post(url).send({});
        //     expect(res.status).toBe(400);
        //     expect(res.body.error).toBe("Todo validation failed: title: Please add a title");
        // });
    });

    // describe("GET /todos/:id", () => {
    //     it('basic case', async () => {
    //         const data = await todoModel.create({
    //             order: 1,
    //             title: "Day 1",
    //         });
    //         const res = await prepare().get('/todos/' + data.id);
    //         expect(res.status).toBe(200);
    //         expect(res.body).toEqual({
    //             success: true,
    //             data: {
    //                 _id: data.id,
    //                 order: data.order,
    //                 title: data.title,
    //                 createdAt: data.createdAt,
    //                 __v: data.__v,
    //             }
    //         });
    //     });
    //     it("wrong id", async () => {
    //         const data = await todoModel.create({
    //             order: 1,
    //             title: "Day 1",
    //         });
    //         const res = await prepare().get("/todos/60bcdd8ad49e70235cce1ce5");
    //         expect(res.status).toBe(400);
    //         expect(res.body).toEqual({
    //             "error": "todo not found with id 60bcdd8ad49e70235cce1ce5",
    //             "data": {}
    //         });
    //     });
    // });

    // describe("PUT /todos/:id", () => {
    //     it('basic case', async () => {
    //         const data = await todoModel.create({
    //             order: 1,
    //             title: "Day 1",
    //         });
    //         const res = await prepare().put('/todos/' + data.id).send({ title: "Day 2" });
    //         expect(res.status).toBe(200);
    //         expect(res.body).toEqual({
    //             success: true,
    //             data: {
    //                 _id: data.id,
    //                 order: data.order,
    //                 title: "Day 2",
    //                 createdAt: data.createdAt,
    //                 __v: data.__v,
    //             }
    //         });
    //     });
    //     it('wrong id', async () => {
    //         const data = await todoModel.create({
    //             order: 1,
    //             title: "Day 1",
    //         });
    //         const res = await prepare().put('/todos/60bcdd8ad49e70235cce1ce6').send({ title: "Day 2" });
    //         expect(res.status).toBe(400);
    //         expect(res.body).toEqual({
    //             "error": "todo not found with id 60bcdd8ad49e70235cce1ce6",
    //             "data": {}
    //         });
    //     });
    //     it('invalid title', async () => {
    //         const data = await todoModel.create({
    //             order: 0,
    //             title: "Day 0",
    //         });
    //         const res = await prepare().put('/todos/' + data.id).send({ t: "Day 1" });
    //         expect(res.status).toBe(400);
    //         expect(res.body).toEqual({
    //             "success": false,
    //             "error": "please add title in http request body"
    //         });
    //     });
    // });

    // describe("DELETE /todos/:id", () => {
    //     it('basic case', async () => {
    //         const data = await todoModel.create({
    //             order: 1,
    //             title: "Day 1",
    //         });
    //         const res = await prepare().delete('/todos/' + data.id);
    //         expect(res.status).toBe(200);
    //         expect(res.body).toEqual({
    //             success: true,
    //             data: {}
    //         });
    //     });

    //     it("wrong id", async () => {
    //         const data = await todoModel.create({
    //             order: 1,
    //             title: "Day 1",
    //         });
    //         const res = await prepare().delete('/todos/60bcdd8ad49e70235cce1ce5');
    //         expect(res.status).toBe(400);
    //         expect(res.body).toEqual({
    //             "error": "todo not found with id 60bcdd8ad49e70235cce1ce5",
    //             "data": {}
    //         });
    //     });
    // });
});