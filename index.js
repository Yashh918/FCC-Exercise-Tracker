import dotenv from 'dotenv'
import { connectDb } from "./db/index.db.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 3030, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`MongoDb connection failed `, err);
    })