const router = require("express").Router();
const UserController = require("../controllers/userControllers");

router.get("/", function(req, res) {
	res.send("Well This works");
});

router.post("/register", UserController.signup);

module.exports = router;
