const chaiHTTP = require("chai-http");
const chai = require("chai");
let expect = chai.expect;
chai.use(chaiHTTP);

let User = require("../models/users");

let app = require("../app");

describe("Users", () => {
	describe("POST/register", () => {
		afterEach(done => {
			User.deleteMany({})
				.then(() => {
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});

		it("should return the created new User + encrypted password", done => {
			let args = {
				name: "eri",
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};

			chai
				.request(app)
				.post("/register")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.a("object");
					expect(res.body.name).to.equal(args.name);
					expect(res.body.password).to.not.equal(args.password);
					expect(res.body.email).to.equal(args.email);
					done();
				});
		});
		it("should show error email is wrong format", done => {
			let args = {
				name: "eri",
				email: "joasndfasdf",
				password: "asdbjhsdfjhbfsjhbdf"
			};
			chai
				.request(app)
				.post("/register")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.be.a("object");
					expect(res.body).to.have.property("error");
					expect(res.body.error).to.equal(
						"User validation failed: email: Please input a valid email format"
					);
					done();
				});
		});
		it("should show invalid length of password alert", done => {
			let args = {
				name: "eri",
				email: "joan@gmail.com",
				password: "as"
			};
			chai
				.request(app)
				.post("/register")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.be.a("object");
					expect(res.body).to.have.property("error");
					expect(res.body.error).to.equal(
						"User validation failed: password: Password Length minimum 8"
					);
					done();
				});
		});

		it("should return fail since mail is ot unique", done => {
			let args = {
				name: "eri",
				email: "joanlamrack@gmail.com",
				password: "123400000"
			};

			chai
				.request(app)
				.post("/register")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.a("object");
					expect(res.body.name).to.equal(args.name);
					expect(res.body.password).to.not.equal(args.password);
					expect(res.body.email).to.equal(args.email);

					chai
						.request(app)
						.post("/register")
						.send(args)
						.end((err, res) => {
							expect(res).to.have.status(400);
							expect(res.body).to.have.property("error");
							expect(res.body.error).to.equal("email must be unique");
							done();
						});
				});
		});
	});

	describe("POST/login", () => {
		afterEach(done => {
			User.deleteMany({})
				.then(() => {
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});

		it("should return user / password is wrong", done => {
			let args = {
				name: "eri",
				email: "joanlamrack@gmail.com",
				password: "123400000"
			};

			chai
				.request(app)
				.post("/register")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.a("object");
					expect(res.body.name).to.equal(args.name);
					expect(res.body.password).to.not.equal(args.password);
					expect(res.body.email).to.equal(args.email);

					chai
						.request(app)
						.post("/login")
						.send({ email: "asdfa", password: "asdfsd" })
						.end((err, res) => {
							expect(res).to.have.status(400);
							expect(res.body).to.have.property("error");
							expect(res.body.error).to.equal("user not found");
							done();
						});
				});
		});
		it("should return success message and token", done => {
			let args = {
				name: "eri",
				email: "joanlamrack@gmail.com",
				password: "123400000"
			};

			chai
				.request(app)
				.post("/register")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.a("object");
					expect(res.body.name).to.equal(args.name);
					expect(res.body.password).to.not.equal(args.password);
					expect(res.body.email).to.equal(args.email);

					chai
						.request(app)
						.post("/login")
						.send({ email: args.email, password: args.email })
						.end((err, res) => {
							expect(res).to.have.status(200);
							expect(res.body).to.have.property("token");
							done();
						});
				});
		});
	});
});
