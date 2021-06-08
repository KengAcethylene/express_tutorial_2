const { prepare, mockDb } = require("../utils/dbTest");
const authRoute = require("../controller/auth");

describe("/auth", () => {
    describe("/register", () => {
        it("basic case", async () => {
            mockDb("User", []);
            const res = await prepare(authRoute).post("/register").send({ name: "Acethylene", email: "Keng2120@gmail.com", password: "chanchai" });
            console.log(res);
            expect(res.status).toBe(200);
        });
    });

    describe("/login", () => {

    });

    describe("/logout", () => {

    });
});