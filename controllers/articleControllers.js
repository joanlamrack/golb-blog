const Article = require("../models/articles");

class ArticleController {
	constructor() {}

	static create(req, res) {
		Article.create({
			title: req.body.title,
			writer: req.body.userId,
			content: req.body.content
		})
			.then(articleCreated => {
				res.status(201).json(articleCreated);
			})
			.catch(err => {
				res.status(400).json(err);
			});
	}

	static deleteById(req, res) {
		Article.findByIdAndRemove({ _id: req.params.articleID })
			.then(articleRemoved => {
				if (articleRemoved) {
					res.status(200).json(articleRemoved);
				} else {
					res.status(404).json({
						message: "article not found"
					});
				}
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

	static getById(req, res) {
		Article.findById(req.params.articleID)
			.then(articleFound => {
				if (articleFound) {
					res.status(200).json(articleFound);
				} else {
					res.status(404).json({
						message: "user not found"
					});
				}
			})
			.catch(err => {
				res.status(400).json(err);
			});
	}

	static updateById(req, res) {
		Article.findByIdAndUpdate(
			req.params.articleID,
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
				res.status(200).json(err);
			});
	}
}

module.exports = ArticleController;
