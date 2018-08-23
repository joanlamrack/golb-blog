const chaiHTTP = require("chai-http");
const chaiMatch = require("chai-match");
const chai = require("chai");
let expect = chai.expect;
let app = require("../app");

const Article = require("../models/articles");
const User = require("../models/users");
const ObjectIdHelper = require("../helpers/objectIdhelper");

chai.use(chaiHTTP);
chai.use(chaiMatch);

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
									.set("token", token)
									.send(articleArgs)
									.end((err, res) => {
										expect(res).to.have.status(201);
										expect(res.body).to.have.property("title");
										expect(res.body).to.have.property("content");
										expect(res.body).to.have.property("writer");

										expect(res.body.title).to.equal(articleArgs.title);
										expect(res.body.content).to.equal(articleArgs.content);
										expect(res.body.writer).to.equal(
											ObjectIdHelper.convertObjectIdToStr(userFound._id)
										);

										User.findOne({ email: "joanlamrack@gmail.com" })
											.then(userfoundagain => {
												expect(
													userfoundagain.articles[0]._id.toString()
												).to.equal(res.body._id);
												done();
											})
											.catch(err => {
												console.log(
													"error at mathcing new article test\n==========>",
													err
												);
											});
									});
							}
						})
						.catch(err => {
							console.log(err);
						});
				});
		});
		it("should show invalid title alert", done => {
			let args = {
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};
			let articleArgs = {
				title:
					"My first Articledfjjkldkljdfsdfsfsadsadfdfsasdfasdfasdfasdfasdfasdfasfdasdfasdfasdfassdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfdf",
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
									.set("token", token)
									.send(articleArgs)
									.end((err, res) => {
										expect(res).to.have.status(400);
										expect(res.body).to.have.property("error");
										expect(res.body.error).to.match(
											/Title cannot be more than 100 characters/
										);
										done();
									});
							}
						})
						.catch(err => {
							console.log(err);
						});
				});
		});
	});

	describe("GET/articles", () => {
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
		it("should return articles", done => {
			let args = {
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};
			let articleArgs = {
				title: "My firstfgsdfgsdfgsdfgsdfgsdfgsdfdf",
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
									.set("token", token)
									.send(articleArgs)
									.end((err, res) => {
										let articleId = res.body._id;
										expect(res).to.have.status(201);
										expect(res.body).to.have.property("title");
										expect(res.body).to.have.property("content");
										expect(res.body).to.have.property("writer");

										expect(res.body.title).to.equal(articleArgs.title);
										expect(res.body.content).to.equal(articleArgs.content);
										expect(res.body.writer).to.equal(
											ObjectIdHelper.convertObjectIdToStr(userFound._id)
										);

										chai
											.request(app)
											.get("/articles")
											.end((err, res) => {
												expect(res).to.have.status(200);
												expect(res.body).to.be.a("array");
												expect(res.body[0]).to.be.a("object");
												expect(res.body[0]).to.have.property("title");
												expect(res.body[0]).to.have.property("content");
												expect(res.body[0]).to.have.property("writer");
												expect(res.body[0].title).to.equal(articleArgs.title);
												expect(res.body[0].content).to.equal(
													articleArgs.content
												);
												expect(res.body[0].writer._id).to.equal(
													ObjectIdHelper.convertObjectIdToStr(userFound._id)
												);
												expect(res.body[0].writer.articles[0]).to.equal(
													articleId
												);
												done();
											});
									});
							}
						})
						.catch(err => {
							console.log(err);
						});
				});
		});
		it("should return empty array", done => {
			chai
				.request(app)
				.get("/articles")
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.a("array");
					expect(res.body.length).to.equal(0);
					done();
				});
		});
	});

	describe("DELETE/articles", () => {
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

			let articleArgs = [
				{
					title: "My firstfgsdfgsdfgsdfgsdfgsdfgsdfdf",
					content: "you know, this is not my stuff ;("
				},
				{
					title: "My firstfgsdfgsdfgsdfgsdfgsdfgsdfasdfdf",
					content: "you know, this is not my asdfstuff ;("
				}
			];

			User.create(args)
				.then(response => {
					return User.create(args2);
				})
				.then(response => {
					chai
						.request(app)
						.post("/login")
						.send({
							email: args.email,
							password: args.password
						})
						.end((err, res) => {
							let token = res.body.token;
							articleArgs.forEach((val, index) => {
								chai
									.request(app)
									.post("/articles")
									.set("token", token)
									.send(val)
									.end((err, res) => {
										expect(res).to.have.status(201);
										if (index === articleArgs.length - 1) {
											done();
										}
									});
							});
						});
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

		it("should return unauthorized", done => {
			chai
				.request(app)
				.get("/articles")
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.a("array");
					expect(res.body.length).to.equal(2);
					let firstArticleIdToBeDeleted = res.body[0]._id;
					chai
						.request(app)
						.delete(`/articles/${firstArticleIdToBeDeleted}`)
						.end((err, res) => {
							expect(res).to.have.status(403);
							expect(res.body).to.have.property("error");
							expect(res.body.error).to.equal("not authorized");
							done();
						});
				});
		});
		it("should return forbidden", done => {
			let args = {
				email: "joanlamracktwo@gmail.com",
				password: "123400003"
			};
			chai
				.request(app)
				.post("/login")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property("token");
					let token = res.body.token;

					chai
						.request(app)
						.get("/articles")
						.end((err, res) => {
							expect(res).to.have.status(200);

							let firstArticleIdToBeDeleted = res.body[0]._id;
							chai
								.request(app)
								.delete(`/articles/${firstArticleIdToBeDeleted}`)
								.set("token", token)
								.end((err, res) => {
									expect(res).to.have.status(406);
									expect(res.body).to.have.property("error");
									expect(res.body.error).to.equal("forbidden");
									done();
								});
						});
				});
		});
		it("should return deleted article", done => {
			let args = {
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};
			chai
				.request(app)
				.post("/login")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property("token");
					let token = res.body.token;

					chai
						.request(app)
						.get("/articles")
						.end((err, res) => {
							expect(res).to.have.status(200);
							let firstArticleObj = res.body[0];
							let firstArticleIdToBeDeleted = res.body[0]._id;
							chai
								.request(app)
								.delete(`/articles/${firstArticleIdToBeDeleted}`)
								.set("token", token)
								.end((err, res) => {
									expect(res.body).to.be.a("object");
									expect(res.body).to.have.property("title");
									expect(res.body).to.have.property("writer");
									expect(res.body).to.have.property("content");
									done();
								});
						});
				});
		});
		it("shouldn't have the reference in User after deleted", done => {
			let args = {
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};
			chai
				.request(app)
				.post("/login")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property("token");
					let token = res.body.token;

					chai
						.request(app)
						.get("/articles")
						.end((err, res) => {
							expect(res).to.have.status(200);
							let firstArticleIdToBeDeleted = res.body[0]._id;
							console.log(
								"Article id to be deleted",
								firstArticleIdToBeDeleted
							);
							chai
								.request(app)
								.delete(`/articles/${firstArticleIdToBeDeleted}`)
								.set("token", token)
								.end((err, res) => {
									console.log(res.body);
									expect(res.body).to.be.a("object");
									expect(res.body).to.have.property("title");
									expect(res.body).to.have.property("writer");
									expect(res.body).to.have.property("content");

									Article.find({})
										.then(res => {
											console.log("article found", res);
										})
										.catch();

									User.findOne({
										email: "joanlamrack@gmail.com",
										articles: res.body._id
									})
										.then(userFound => {
											if (!userFound) {
												done();
											}
										})
										.catch(err => {
											console.log(err);
										});
								});
						});
				});
		});
	});

	describe("PATCH/", () => {
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

			let articleArgs = [
				{
					title: "My firstfgsdfgsdfgsdfgsdfgsdfgsdfdf",
					content: "you know, this is not my stuff ;("
				},
				{
					title: "My firstfgsdfgsdfgsdfgsdfgsdfgsdfasdfdf",
					content: "you know, this is not my asdfstuff ;("
				}
			];

			User.create(args)
				.then(response => {
					return User.create(args2);
				})
				.then(response => {
					chai
						.request(app)
						.post("/login")
						.send({
							email: args.email,
							password: args.password
						})
						.end((err, res) => {
							let token = res.body.token;
							articleArgs.forEach((val, index) => {
								chai
									.request(app)
									.post("/articles")
									.set("token", token)
									.send(val)
									.end((err, res) => {
										expect(res).to.have.status(201);
										if (index === articleArgs.length - 1) {
											done();
										}
									});
							});
						});
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
		it("should return newly patched article", done => {
			let args = {
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};
			let updateargs = {
				title: "hahahah",
				content: "asdfasd"
			};

			chai
				.request(app)
				.post("/login")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property("token");
					let token = res.body.token;

					chai
						.request(app)
						.get("/articles")
						.end((err, res) => {
							expect(res).to.have.status(200);
							let firstArticleIdToBeUpdated = res.body[0]._id;
							console.log(
								"Article id to be updated",
								firstArticleIdToBeUpdated
							);
							chai
								.request(app)
								.patch(`/articles/${firstArticleIdToBeUpdated}`)
								.send(updateargs)
								.set("token", token)
								.end((err, res) => {
									expect(res.body).to.be.a("object");
									expect(res.body).to.have.property("title");
									expect(res.body).to.have.property("writer");
									expect(res.body).to.have.property("content");

									expect(res.body.title).to.equal(updateargs.title);
									expect(res.body.content).to.equal(updateargs.content);
									done();
								});
						});
				});
		});
		it("should show alert that one of the field invalid and the article should not be updated", done => {
			let args = {
				email: "joanlamrack@gmail.com",
				password: "12340000"
			};
			let updateargs = {
				title:
					"hahahahfsdnjfnjdfnjdfffjkfjkfjkjkjkjkjksdjkdfjkjkjkjkjkjkjkjkasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdf",
				content: "asdfasd"
			};

			chai
				.request(app)
				.post("/login")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property("token");
					let token = res.body.token;

					chai
						.request(app)
						.get("/articles")
						.end((err, res) => {
							expect(res).to.have.status(200);
							let firstArticleIdToBeUpdated = res.body[0]._id;
							console.log(
								"Article id to be updated",
								firstArticleIdToBeUpdated
							);
							chai
								.request(app)
								.patch(`/articles/${firstArticleIdToBeUpdated}`)
								.send(updateargs)
								.set("token", token)
								.end((err, res) => {
									expect(res).to.have.status(400);
									expect(res.body).to.have.property("error");
									expect(res.body.error).match(
										/Title cannot be more than 100 characters/
									);
									done();
								});
						});
				});
		});

		it("should show forbidden", done => {
			let args = {
				email: "joanlamracktwo@gmail.com",
				password: "123400003"
			};
			let updateargs = {
				title: "hahahah",
				content: "asdfasd"
			};

			chai
				.request(app)
				.post("/login")
				.send(args)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property("token");
					let token = res.body.token;

					chai
						.request(app)
						.get("/articles")
						.end((err, res) => {
							expect(res).to.have.status(200);
							let firstArticleIdToBeUpdated = res.body[0]._id;
							console.log(
								"Article id to be updated",
								firstArticleIdToBeUpdated
							);
							chai
								.request(app)
								.patch(`/articles/${firstArticleIdToBeUpdated}`)
								.send(updateargs)
								.set("token", token)
								.end((err, res) => {
									expect(res).to.have.status(406);
									expect(res.body).to.have.property("error");
									expect(res.body.error).to.equal("forbidden");
									done();
								});
						});
				});
		});
	});
});
