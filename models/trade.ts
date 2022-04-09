import { Schema, model, Types,models} from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Trades {
	userID: Types.ObjectId;
	productTitle:String;
	productDescription: String;
	imageURls: [String];
	open: Boolean;
	date:any
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Trades>(
	{
		userID:{ type: Schema.Types.ObjectId, ref: "User" ,required:true },
		productTitle: { type: String, required: true },
		productDescription: { type: String, required: true },
		imageURls:[{type: String}],
		open: { type: Boolean, required: true },
		date:{ type: Schema.Types.Date, default:Date.now() },
	}
);

// 3. Create a Model.
export {schema as schema}
export default models.Trades || model<Trades>('Trades', schema);