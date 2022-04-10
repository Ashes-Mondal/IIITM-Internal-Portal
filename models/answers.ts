import { Schema, model, Types,models} from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Answers {
	userID: Types.ObjectId;
	questionID: Types.ObjectId;
	answer: String;
	comments:Types.ArraySubdocument;
	upvote:Types.ArraySubdocument;
	downvote:Types.ArraySubdocument;
	date:any
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Answers>(
	{
		userID:{ type: Schema.Types.ObjectId, ref: "User" ,required:true },
		questionID: { type: Schema.Types.ObjectId, ref: "Questions" ,required:true },

		answer: { type: String, required: true },
		comments:[{ type: Schema.Types.ObjectId, ref: "Comments" }],

		upvote: [{ type: Schema.Types.ObjectId, ref: "User"}],
		downvote:[{ type: Schema.Types.ObjectId, ref: "User"}],
		
		date:{ type: Schema.Types.Date, default:Date.now },
	},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export {schema as schema}
// 3. Create a Model.
export default models.Answers || model<Answers>('Answers', schema);