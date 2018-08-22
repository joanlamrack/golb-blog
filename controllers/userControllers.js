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
				res.status(400).json({
					error: err.message
				});
			});
	}

	static login(req, res) {
		User.aggregate([{ $match: { email: req.body.email } }])
			.then(userFound => {
				if (userFound.length) {
					let token = AuthHelper.createToken({ id: userFound._id });
					res.status(200).json({
						token: token
					});
				} else {
					res.status(400).json({
						error: "user not found"
					});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(400).json({
					error: err.message
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
