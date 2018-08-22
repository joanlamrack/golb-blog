const router = require("express").Router();
const UserController = require("../controllers/userControllers");
const ArticleRoute = require("./articles");

router.use("/articles", ArticleRoute);

router.get("/", function(req, res) {
	res.send("Well This works");
});

router.post("/register", UserController.signup);
router.post("/login", UserController.login);

module.exports = router;
