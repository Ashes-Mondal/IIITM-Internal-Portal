import { Schema, model, Types, models } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface UserInfo {
	name: string;
	email: string;
	headline: string;
	linkedin:string;
	image: string;
	emailVerified: any;
	starredQuestions:[Types.ObjectId]
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<UserInfo>(
	{
		name: { type: String,default:function(){
			return this.email.split('@')[0] || null
		}},
		email: { type: String, required: true },
		headline: { type: String, default:"Hi i am a new user" },
		linkedin: { type: String},
		image: { type: String},
		emailVerified: { type: Schema.Types.Date },
		starredQuestions:[{type:Schema.Types.ObjectId}]
	}
);

// 3. Create a Model.
export {schema as schema}
export default models.User || model<UserInfo>('User', schema);