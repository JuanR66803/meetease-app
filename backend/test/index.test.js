/* eslint-disable no-undef */
import request from "supertest";
import app from "../index.js";

/* eslint-env jest */
describe("Pruebas del servidor", () => {
  test("GET / debería responder con un mensaje", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Backend de MeetEase funcionando 🚀");
  });
});
