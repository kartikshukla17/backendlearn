import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";   

const videoSchema = new  Schema({
    videoFile : {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    duration:{
        type: String, 
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
    }
)

videoSchema.plugin(mongooseAggregatePaginate) //AGGregation pipeline aayega! 

export const Video = mongoose.model("Video", videoSchema)