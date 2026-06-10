import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

export const databaseProvider = {
  provide: PG_POOL,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new Pool({
      host: config.get<string>('DB_HOST') || '127.0.0.1',
      port: Number(config.get<string>('DB_PORT') || 5433),
      database: config.get<string>('DB_NAME') || 'utility_app',
      user: config.get<string>('DB_USER') || 'postgres',
      password: config.get<string>('DB_PASSWORD') || 'postgres',
    });
  },
};