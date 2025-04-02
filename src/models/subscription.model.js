import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //the one who is subscribing
        ref: "User"
    },
    channel: {
       type: Schema.Types.ObjectId, //the one who is subscribed
        ref: "User"
    }
},
{
    timestamps: true,
})

export const subscription = mongoose.model("Subscription", subscriptionSchema)