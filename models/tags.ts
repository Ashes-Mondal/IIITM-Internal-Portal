import { Schema, model, Types,models} from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface Tags {
	value:String;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Tags>(
	{
		value: { type: String, required: true },
	}
);

// 3. Create a Model.
export {schema as schema}
export default models.Tags || model<Tags>('Tags', schema);