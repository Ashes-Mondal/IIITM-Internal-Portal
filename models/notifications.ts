import { Schema, model, Types,models} from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Notifications {
	userID: Types.ObjectId;
	type:String;
	notification: String;
	title: String;
	date:any
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Notifications>(
	{
		userID:{ type: Schema.Types.ObjectId, ref: "User" ,required:true },
		type: { type: String, required: true,default:"Normal" },
		notification: { type: String, required: true },
		title: { type: String, required: true },

		date:{ type: Schema.Types.Date, default:Date.now },
	},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// 3. Create a Model.
export {schema as schema}
export default models.Notifications || model<Notifications>('Notifications', schema);