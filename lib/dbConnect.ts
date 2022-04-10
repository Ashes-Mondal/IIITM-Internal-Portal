import mongoose from 'mongoose'
import {schema as userSchema} from '../models/users';
import {schema as questionSchema} from '../models/questions';
import {schema as tagSchema} from '../models/tags';
import {schema as ComSchema} from '../models/comments';
import {schema as AnsSchema} from '../models/answers';




const allModels = [
	{name:"User",schema:userSchema},
	{name:"Questions",schema:questionSchema},
	{name:"Tags",schema:tagSchema},
	{name:"Comments",schema:ComSchema},
	{name:"Answers",schema:AnsSchema},

]

const MONGODB_URI = process.env.MONGODB_URI
// console.log(MONGODB_URI)

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	)
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface mongoIns {
	conn: any;
	// promise: any;
	gfs: any
}
let cached: mongoIns = global.mongoose

if (!cached) {
	cached = global.mongoose = {
		conn: null,
		// promise: null,
		gfs: null
	}
}


async function dbConnect(): Promise<mongoIns> {

	if (cached.conn && cached.gfs) {
		return cached
	} else if (cached.conn) {
		try {
			cached.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
				bucketName: "uploads",
			});
		} catch (error) {
			console.error("FAILED", error);
		}
		return cached
	}

	if (!cached.conn) {
		const opts = {
			bufferCommands: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}

		cached.conn = await mongoose.connect(MONGODB_URI, opts)
		for(let i = 0;i<allModels.length;i++)
		{
			cached.conn.model(allModels[i].name,allModels[i].schema)
		}
		try {
			cached.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
				bucketName: "uploads",
			});
		} catch (error) {
			console.error("Failed to connect to DB!", error);
			process.exit()
		}
	}
	return cached
}

export default dbConnect