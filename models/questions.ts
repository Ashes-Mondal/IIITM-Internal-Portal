import { Schema, model, Types, models } from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Question {
	userID: Types.ObjectId;
	questionTitle: string;
	question: string;
	answers: Types.ArraySubdocument;
	tags: [String];
	upvote: Types.ArraySubdocument;
	downvote: Types.ArraySubdocument;
	comments: Types.ArraySubdocument;
	views: Number;
	date: any
};

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Question>(
	{
		userID: { type: Schema.Types.ObjectId, ref: "User", required: true },

		questionTitle: { type: String, required: true },
		question: { type: String, required: true },
		answers: [{ type: Schema.Types.ObjectId, ref: "Answers" }],

		tags: [{ type: String }],
		upvote: [{ type: Schema.Types.ObjectId, ref: "User" }],
		downvote: [{ type: Schema.Types.ObjectId, ref: "User" }],
		comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
		views: { type: Number, default: 0 },

		date: { type: Schema.Types.Date, default: Date.now },

	}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// 3. Create a Model.
export { schema as schema }
export default models.Questions || model('Questions', schema);