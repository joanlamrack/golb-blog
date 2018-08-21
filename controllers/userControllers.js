const User = require("../models/users");
const AuthHelper = require("../helpers/authhelper");

class UserController {
	constructor() {}

	static signup(req, res) {
		User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		})
			.then(response => {
				res.status(201).json(response);
			})
			.catch(err => {
				console.log(err);
				res.status(400).json({
					error: err.message
				});
			});
	}

	static login(req, res) {
		User.findOne({ email: req.body.email })
			.then(userFound => {
				if (userFound) {
					let token = AuthHelper.createToken(userFound._id);
					console.log("the token is", token, "containing", userFound._id);
					res.status(200).json({
						token: token
					});
				} else {
					res.status(400).json({
						message: "User not Found"
					});
				}
			})
			.catch(err => {
				res.status(200).json({
					message: err.message,
					data: err
				});
			});
	}

	static getArticles(req, res) {
		let token = req.headers.token;
		let id = AuthHelper.decodeToken(token);
		User.findById(id)
			.populate("articles")
			.then(userFound => {
				if (userFound) {
					if (userFound.articles.length) {
						res.status(200).json({
							message: "Articles Found",
							data: userFound.articles
						});
					} else {
						res.status(200).json({
							message: "No articles"
						});
					}
				} else {
					res,
					status(400).json({
						message: "No such user found"
					});
				}
			})
			.catch(err => {
				res.status(400).json({
					message: err.message,
					data: err
				});
			});
	}
}

module.exports = UserController;
