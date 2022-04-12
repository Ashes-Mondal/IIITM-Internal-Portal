import { Schema, model, Types,models} from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Trades {
	userID: Types.ObjectId;
	productName:String;
	description: String;
	image: String;
	open: Boolean;
	cost: Number;
	date:any
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Trades>(
	{
		userID:{ type: Schema.Types.ObjectId, ref: "User" ,required:true },
		productName: { type: String, required: true },
		description: { type: String, required: true },
		image:{type: String},
		open: { type: Boolean, required: true,default:true },
		cost: { type: Number, required: true },
		date:{ type: Schema.Types.Date, default:Date.now },
	},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// 3. Create a Model.
export {schema as schema}
export default models.Trades || model<Trades>('Trades', schema);