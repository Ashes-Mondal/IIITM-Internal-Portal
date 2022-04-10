import { Schema, model, Types, models } from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Comments {
	userID: Types.ObjectId;
	answerID: Types.ObjectId;
	questionID: Types.ObjectId;
	comment: String;
	date: any
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Comments>(
	{
		userID: { type: Schema.Types.ObjectId, ref: "User", required: true },

		answerID: { type: Schema.Types.ObjectId, ref: "Answers" },
		questionID: { type: Schema.Types.ObjectId, ref: "Questions" },

		comment: { type: String, required: true },

		date: { type: Schema.Types.Date, default: Date.now },
	},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export { schema as schema }
// 3. Create a Model.
export default models.Comments || model<Comments>('Comments', schema);