import { Router } from "express";
import {
    createUser,
    getUsers,
    putExercise,
    getExercise
} from "../controllers/user.controllers.js"

const router = Router()

router
    .route('/users')
    .post(createUser)
    .get(getUsers)
router
    .route('/users/:_id/exercises')
    .post(putExercise)
router
    .route('/users/:_id/logs')
    .get(getExercise)

export default router