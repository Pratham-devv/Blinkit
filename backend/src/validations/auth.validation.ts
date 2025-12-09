import Joi from "joi";

export const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required()
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional()
});
