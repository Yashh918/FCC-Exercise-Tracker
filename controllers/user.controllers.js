import { Schema } from "mongoose";
import { mongoose } from "mongoose";
import { Exercise } from "../models/exercise.models.js";
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createUser = asyncHandler(async (req, res) => {
    const { username } = req.body

    const user = await User.create({
        username
    })

    const response = {
        _id: user._id,
        username: user.username
    }

    return res
        .status(200)
        .json(response)
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, 'username _id')
    return res
        .status(200)
        .json(users)
})

const putExercise = asyncHandler(async (req, res) => {
    const { _id } = req.params
    const { description, duration, date } = req.body

    const formattedDate = date ? new Date(date).toDateString() : new Date().toDateString();

    const user = await User.findById(_id);
    if (!user) {
        return res
            .status(404)
            .json({
                success: "false",
                message: "User not found"
            })
    }

    const exercise = await Exercise.create({
        userId: user._id,
        username: user.username,
        description,
        duration,
        date: formattedDate
    })

    const response = {
        _id: user._id,
        username: user.username,
        date: exercise.date,
        duration: exercise.duration,
        description: exercise.description
    }

    return res
        .status(200)
        .json(response)
})

const getExercise = asyncHandler(async (req, res) => {
    const { _id } = req.params
    const {from, to, limit} = req.query

    const exercises = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(_id)
            }
        },
        {
            $lookup: {
                from: "exercises",
                localField: "_id",
                foreignField: "userId",
                as: "log"
            }
        },
        {
            $addFields: {
                log: {
                    $map: {
                        input: "$log",
                        as: "entry",
                        in: {
                            description: "$$entry.description",
                            duration: "$$entry.duration",
                            date: "$$entry.date"
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                log: {
                    $filter: {
                        input: "$log",
                        as: "entry",
                        cond: {
                            $and: [
                                from ? { $gte: [{ $dateFromString: { dateString: "$$entry.date" } }, new Date(from)] } : {},
                                to ? { $lte: [{ $dateFromString: { dateString: "$$entry.date" } }, new Date(to)] } : {}
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                count: { $size: "$log" }
            }
        },
        {
            $project: {
                _id: 1,
                username: 1,
                count: 1,
                log: { $slice: ["$log", limit ? parseInt(limit): {$size: "$log"}]}
            }
        }
    ])

    return res
        .status(200)
        .json(exercises[0])
})


export {
    createUser,
    getUsers,
    putExercise,
    getExercise
}