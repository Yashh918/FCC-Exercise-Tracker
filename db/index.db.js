import mongoose from "mongoose";
const dbName = 'ExerciseTracker'

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
        console.log(`\n Connected to MongoDb successfully !!! Db host: ${connectionInstance.connection.host}`)
    } catch (err) {
        console.log(`MongoDb connection failed `, err);
    }
}

export {connectDb}