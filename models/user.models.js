import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String
    }
})

export const User = model("User", userSchema)