const router = require("express").Router();
const ArticleController = require("../controllers/articleControllers");
const AuthMiddleware = require("../middlewares/authMiddleware");

router
	.route("/")
	.get(ArticleController.getAll)
	.post(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		ArticleController.create
	);

router
	.route("/:id")
	.delete(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		AuthMiddleware.checkifArticleOwnedByUser,
		ArticleController.deleteById
	)
	.patch(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		AuthMiddleware.checkifArticleOwnedByUser,
		ArticleController.updateById
	)
	.get(ArticleController.getById);

module.exports = router;
