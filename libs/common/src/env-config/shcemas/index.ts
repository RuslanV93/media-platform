import * as Joi from 'joi';

const baseSchema = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number(),
};

export const apiGatewaySchema = Joi.object({
  ...baseSchema,

  USER_SERVICE_URL: Joi.string(),
  CONTENT_SERVICE_URL: Joi.string(),
});

export const userServiceSchema = Joi.object({
  ...baseSchema,
  USER_SERVICE_DATABASE_URL: Joi.string(),
});
