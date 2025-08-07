import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// This a hybrid microservice (REST + MS with NATS)

/* By default a hybrid application will not inherit global pipes, interceptors, guards and filters configured 
for the main (HTTP-based) application. */

async function bootstrap() {
  const logger = new Logger('PaymentsMS');

  // REST configuration

  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Needed for Stripe webhooks
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // MS configuration

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
    { inheritAppConfig: true }, // get the config from the main app
  );

  await app.startAllMicroservices();

  await app.listen(envs.port);

  logger.log(`Payments Microservice is running on port ${envs.port}`);
}
bootstrap();
