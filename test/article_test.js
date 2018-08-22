const chaiHTTP = require("chai-http");
const chai = require("chai");
let expect = chai.expect;
let app = require("../app");

const Article = require("../models/articles");
const User = require("../models/users");

chai.use(chaiHTTP);

describe("Articles", () => {
	describe("POST/articles", () => {
		beforeEach(done => {
			let args = {
				name: "eri",
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};

			let args2 = {
				name: "eri2",
				email: "joanlamracktwo@gmail.com",
				password: "123400003"
			};

			User.create(args)
				.then(response => {
					return User.create(args2);
				})
				.then(response => {
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});

		afterEach(done => {
			User.deleteMany({})
				.then(response => {
					return Article.deleteMany({});
				})
				.then(response => {
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});

		it("should show unathorized alert", done => {
			let articleInput = {
				title: "asdfasdfs",
				content: "asdfasdfasdfasdf"
			};

			chai
				.request(app)
				.post("/articles")
				.send(articleInput)
				.end((err, res) => {
					expect(res).to.have.status(403);
					expect(res.body).to.have.property("error");
					done();
				});
		});
		it("should return the created new Article", done => {
			let args = {
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};
			let articleArgs = {
				title: "My first Article",
				content: "you know, this is not my stuff ;("
			};

			chai
				.request(app)
				.post("/login")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property("token");
					let token = res.body.token;

					User.findOne({ email: "joanlamrack@gmail.com" })
						.then(userFound => {
							if (userFound) {
								chai
									.request(app)
									.post("/articles")
									.send(articleArgs)
									.end((err, res) => {
										expect(res).to.have.status(201);
										expect(res.body).to.have.property("title");
										expect(res.body).to.have.property("content");
										expect(res.body).to.have.property("writer");

										expect(res.body.title).to.equal(articleArgs.title);
										expect(res.body.content).to.equal(articleArgs.content);
										expect(res.body.writer).to.equal(userFound._id);
										done();
									});
							} else {
							}
						})
						.catch(err => {
							console.log(err);
						});
				});
		});
		it("should show error password / email is wrong");
		it("should show invalid of article length alert");
		it("should show invalid email alert");
	});

	describe("GET/articles", () => {
		it("should return articles");
		it("should return empty array");
	});

	describe("DELETE/articles", () => {
		it("should return unauthorized");
		it("should return forbidden");
		it("should return deleted article");
		it("shouldn't have the reference in User after deleted");
	});

	describe("PATCH/", () => {
		it("should return newly patched article");

		it(
			"should show alert that one of the field invalid and the article should not be updated"
		);
	});
});
