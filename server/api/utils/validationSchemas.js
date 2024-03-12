import Joi from "joi";

const nicknameSchema = Joi.string().min(1).max(10).required();
const roomIdSchema = Joi.string().required();

const createRoomSchema = Joi.object({
    nickname: nicknameSchema,
});

const joinRoomSchema = Joi.object({
    roomId: roomIdSchema,
    nickname: nicknameSchema,
});

const addBotSchema = Joi.object({
    difficulty: Joi.string().valid("easy", "hard", "insane").required(),
    roomId: roomIdSchema,
});


const removeUserSchema = Joi.object({
    userId: Joi.string().required(),
    roomId: roomIdSchema
});

const applyMoveSchema = Joi.object({
    roomId: Joi.string().required(),
    move: Joi.object({
        row: Joi.number().required(),
        col: Joi.number().required(),
    }),
});


export  {
    roomIdSchema,
    createRoomSchema,
    joinRoomSchema,
    addBotSchema,
    removeUserSchema,
    applyMoveSchema,
};
