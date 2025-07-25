import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/contacts", () => {
	beforeEach(async () => {
		await UserTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it("should create a new contact if request is valid", async () => {
		const response = await supertest(web)
			.post("/api/contacts")
			.set("X-API-TOKEN", "test")
			.send({
				first_name: "Ilham",
				last_name: "B",
				email: "ilhamb@exaample.com",
				phone: "1234567890",
			});

		logger.debug(response.body);
		expect(response.status).toBe(201);
		expect(response.body.data.id).toBeDefined();
		expect(response.body.data.first_name).toBe("Ilham");
		expect(response.body.data.last_name).toBe("B");
		expect(response.body.data.email).toBe("ilhamb@exaample.com");
		expect(response.body.data.phone).toBe("1234567890");
	});

	it("should reject create new contact if data is invalid", async () => {
		const response = await supertest(web)
			.post("/api/contacts")
			.set("X-API-TOKEN", "test")
			.send({
				first_name: "",
				last_name: "",
				email: "invalid-email",
				phone: "not-a-phone-number",
			});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});

describe("GET /api/contacts/:contactId", () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it("should return contact details if contact exists", async () => {
		const contact = await ContactTest.get();
		const response = await supertest(web)
			.get(`/api/contacts/${contact.id}`)
			.set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.id).toBeDefined();
		expect(response.body.data.first_name).toBe(contact.first_name);
		expect(response.body.data.last_name).toBe(contact.last_name);
		expect(response.body.data.email).toBe(contact.email);
		expect(response.body.data.phone).toBe(contact.phone);
	});

	it("should reject get contact if contact is not found", async () => {
		const contact = await ContactTest.get();
		const response = await supertest(web)
			.get(`/api/contacts/${contact.id + 1}`) // Non-existing contact ID
			.set("X-API-TOKEN", "test");
		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});

describe("PUT /api/contacts/:contactId", () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it("should be able to update contact details", async () => {
		const contact = await ContactTest.get();
		const response = await supertest(web)
			.put(`/api/contacts/${contact.id}`)
			.set("X-API-TOKEN", "test")
			.send({
				first_name: "ilham",
				last_name: "best",
				email: "ilhambest@example.com",
				phone: "0987654321",
			});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.id).toBe(contact.id);
		expect(response.body.data.first_name).toBe("ilham");
		expect(response.body.data.last_name).toBe("best");
		expect(response.body.data.email).toBe("ilhambest@example.com");
		expect(response.body.data.phone).toBe("0987654321");
	});

	it("should reject update contact if data is invalid", async () => {
		const contact = await ContactTest.get();
		const response = await supertest(web)
			.put(`/api/contacts/${contact.id}`)
			.set("X-API-TOKEN", "test")
			.send({
				first_name: "",
				last_name: "",
				email: "invalid-email",
				phone: "not-a-phone-number",
			});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});

describe("DELETE /api/contacts/:contactId", () => {
	beforeEach(async () => {
		await UserTest.create();
		await ContactTest.create();
	});

	afterEach(async () => {
		await ContactTest.deleteAll();
		await UserTest.delete();
	});

	it("should be able to remove contact", async () => {
		const contact = await ContactTest.get();
		const response = await supertest(web)
			.delete(`/api/contacts/${contact.id}`)
			.set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data).toBe("OK");
	});

	it("should reject delete contact if it does not exist", async () => {
		const contact = await ContactTest.get();
		const response = await supertest(web)
			.delete(`/api/contacts/${contact.id + 1}`) // Non-existing contact ID
			.set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});
