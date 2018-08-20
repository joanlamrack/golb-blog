const chaiHTTP = require("chai-http");
const chai = require("chai");

chai.use(chaiHTTP);

describe("Users", function() {

	describe("POST/register", function() {
		it("should return the created new User + encrypted password");
		it("should show error password / email is wrong");
		it("should show invalid length of password alert");
		it("should show invalid email alert");
	});

	describe("POST/login", function() {
		it("should return user / password is wrong");
		it("should return success message and token");
	});
});
