/* 
  Strongly types environment variables for accessing by the ConfigService
  Should be synced with the .env and .env.example files in order to keep consistency over the application environment variables
*/

interface Environment {
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;

  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production';
}
