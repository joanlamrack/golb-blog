const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ArticleSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			maxlength: [150, "Title cannot be more than 150 characters"]
		},
		writer: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		content: {
			type: String,
			required: true
		}
	},
	{
		timestamps: {
			createdAt: "createdAt",
			updatedAt: "updatedAt"
		}
	}
);

ArticleSchema.pre("remove", function(next) {
	let article = this;

	article
		.model("User")
		.update(
			{ _id: article.writer },
			{ $pull: { articles: { _id: article._id } } }
		)
		.then(response=>{
			console.log(response);
			next();
		})
		.catch(err=>{
			res.status(400).json({
				message:err.message,
				data:err
			})
		})
});

module.exports = mongoose.model("Article", ArticleSchema);
