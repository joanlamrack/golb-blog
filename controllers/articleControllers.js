const Article = require("../models/articles");
const User = require("../models/users");

class ArticleController {
	constructor() {}

	static create(req, res) {
		Article.create({
			title: req.body.title,
			writer: req.headers.userId,
			content: req.body.content
		})
			.then(articleCreated => {
				res.status(201).json(articleCreated);
				return User.findOneAndUpdate(
					{ _id: req.headers.userId },
					{ $push: { articles: articleCreated._id } }
				);
			})
			.then(() => {})
			.catch(err => {
				res.status(400).json({
					error: err.message
				});
			});
	}

	static deleteById(req, res) {
		Article.findByIdAndRemove(req.params.id)
			.then(articleRemoved => {
				if (articleRemoved) {
					res.status(200).json(articleRemoved);

					return User.findByIdAndUpdate(
						{ _id: articleRemoved.writer },
						{ $pull: { articles: articleRemoved._id } },
						{ new: true }
					);
				} else {
					res.status(404).json({
						message: "article not found"
					});
				}
			})
			.then(response => {
				// console.log("updated user", response);
			})
			.catch(err => {
				res.status(200).json(err);
			});
	}

	static getAll(req, res) {
		Article.find({})
			.populate("writer")
			.sort({ createdAt: -1 })
			.then(articles => {
				res.status(200).json(articles);
			})
			.catch(err => {
				res.status(400).json(err);
			});
	}

	static getUserOwnArticles(req, res) {
		User.findById(req.headers.userId)
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

	static getById(req, res) {
		Article.findById(req.params.articleID)
			.then(articleFound => {
				if (articleFound) {
					res.status(200).json(articleFound);
				} else {
					res.status(404).json({
						message: "article not found"
					});
				}
			})
			.catch(err => {
				res.status(400).json(err);
			});
	}

	static updateById(req, res) {
		Article.findByIdAndUpdate(
			req.params.id,
			{
				title: req.body.title,
				content: req.body.content
			},
			{ runValidators: true, new: true }
		)
			.then(updatedArticle => {
				res.status(200).json(updatedArticle);
			})
			.catch(err => {
				res.status(400).json({
					error:err.message
				});
			});
	}
}

module.exports = ArticleController;
