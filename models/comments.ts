import { Schema, model, Types,models} from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Comments {
	userID: Types.ObjectId;
	answerID: Types.ObjectId;
	parentCommentID: Types.ObjectId;
	comment: String;
	comments:Types.ArraySubdocument;
	date:any
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Comments>(
	{
		userID:{ type: Schema.Types.ObjectId, ref: "User" ,required:true },

		answerID: { type: Schema.Types.ObjectId, ref: "Answers"},
		parentCommentID: { type: Schema.Types.ObjectId, ref: "Comments" },

		comment: { type: String, required: true },
		comments:[{ type: Schema.Types.ObjectId, ref: "Comments" }],

		date:{ type: Schema.Types.Date, default:Date.now() },
	}
);

export {schema as schema}
// 3. Create a Model.
export default models.Comments || model<Comments>('Comments', schema);