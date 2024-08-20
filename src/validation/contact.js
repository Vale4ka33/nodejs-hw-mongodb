import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required'
  }),
  phoneNumber: Joi.number().required().messages({
    'number.base': 'Phone number should be a number',
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email should be a valid email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Is Favourite should be a boolean'
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
    'string.base': 'Contact type should be a string',
    'any.only': 'Contact type must be one of the following: work, home, personal',
    'any.required': 'Contact type is required'
  })
});


export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  phoneNumber: Joi.number().messages({
    'number.base': 'Phone number should be a number',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email should be a valid email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Is Favourite should be a boolean'
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'Contact type should be a string',
    'any.only': 'Contact type must be one of the following: work, home, personal',
  })
}).min(1);
