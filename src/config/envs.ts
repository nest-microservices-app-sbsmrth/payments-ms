import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_WEBHOOK_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().uri().required(),
    STRIPE_CANCEL_URL: joi.string().uri().required(),
    NATS_SERVERS: joi.array().items(joi.string().uri()).required(),
  })
  .unknown(true); // Allow unknown properties

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
}) as {
  error: joi.ValidationError;
  value: EnvVars;
};

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  stripe: {
    secretKey: envVars.STRIPE_SECRET_KEY,
    webhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
    successUrl: envVars.STRIPE_SUCCESS_URL,
    cancelUrl: envVars.STRIPE_CANCEL_URL,
  },
};
