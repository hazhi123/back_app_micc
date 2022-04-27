import { ConnectionOptions } from 'typeorm';

require('dotenv').config();

export const typeormConfig: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    migrationsRun: false,
    entities: ["src/**/*.entity{.ts,.js}"],
    migrations: ["src/databases/migrations/*{.ts,.js}"],
    cli: {
        migrationsDir: 'src/databases/migrations'
    },
};

module.exports = {
    ...typeormConfig,
    seeds: ['src/databases/seeds/**/*.seeder{.ts,.js}'],
    factories: ["src/databases/factories/**/*.factory{.ts,.js}"],
};