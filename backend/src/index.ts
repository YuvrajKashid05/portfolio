import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';

const PORT = parseInt(env.PORT, 10) || 5000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully via Prisma');

    const server = app.listen(PORT, () => {
      console.log('Portfolio API server listening on http://localhost:' + PORT);
      console.log('Environment: ' + env.NODE_ENV);
      console.log('CORS Origin: ' + env.CORS_ORIGIN);
    });

    const shutdown = async (signal: string) => {
      console.log('Received ' + signal + '. Shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start application:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
