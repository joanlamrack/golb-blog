const chaiHTTP = require("chai-http");
const chai = require("chai");

chai.use(chaiHTTP);

describe("Articles", function() {
	describe("POST/articles", function() {
		it("should show unathorized alert");
		it("should return the created new Article");
		it("should show error password / email is wrong");
		it("should show invalid of article length alert");
		it("should show invalid email alert");
	});

	describe("GET/articles", function() {
		it("should return articles");
		it("should return empty array");
	});

	describe("DELETE/articles", function() {
		it("should return unauthorized");
		it("should return forbidden");
		it("should return deleted article");
		it("shouldn't have the reference in User after deleted");
	});

	describe("PATCH/", function() {
		it("should return newly patched article");

		it(
			"should show alert that one of the field invalid and the article should not be updated"
		);
	});
});
