import { Schema, model, Types,models} from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Notifications {
	userID: Types.ObjectId;
	type:String;
	content: String;
	date:any
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Notifications>(
	{
		userID:{ type: Schema.Types.ObjectId, ref: "User" ,required:true },
		type: { type: String, required: true,default:"Normal" },
		content: { type: String, required: true },
		date:{ type: Schema.Types.Date, default:Date.now() },
	}
);

// 3. Create a Model.
export {schema as schema}
export default models.Notifications || model<Notifications>('Notifications', schema);