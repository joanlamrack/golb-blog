const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Authhelper = require("../helpers/authhelper");

let UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [
				/^\w+@([a-z]+\.)+[a-z]{2,3}$/gi,
				"Please input a valid email format"
			]
		},
		password: {
			type: String,
			required: true,
			minlength: [8, "Password Length minimum 8"]
		},
		articles: [
			{
				type: Schema.Types.ObjectId,
				ref: "Article"
			}
		]
	},
	{
		timestamps: {
			createdAt: "createdAt",
			updatedAt: "updatedAt"
		}
	}
);

UserSchema.pre("save", function(next) {
	if (this.isNew) {
		let user = this;

		let password = Authhelper.hashpass(user.email + user.password);
		user.password = password;
		user.save();
	}
	next();
});

UserSchema.pre("remove", function(next) {
	let user = this;

	user
		.model("Article")
		.remove({ _id: { $in: user.articles } })
		.then(response => {
			console.log(response);
			next();
		})
		.catch(err => {
			res.status(400).json({
				message: err.message,
				data: err
			});
		});
});

module.exports = mongoose.model("User", UserSchema);
