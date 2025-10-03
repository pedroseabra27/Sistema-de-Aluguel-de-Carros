import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { admin } from 'better-auth/plugins';
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from '$env/static/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: { ...schema, users: schema.user }
	}),
	plugins: [admin()],
	emailAndPassword: {
		enabled: true
	},
	trustedOrigins: [
		'http://localhost:5173',
		'https://sistema-de-aluguel-de-carros-production.up.railway.app'
	],
	baseURL: BETTER_AUTH_URL,
	secret: BETTER_AUTH_SECRET,
	origin: ['http://localhost:5173', 'https://sistema-de-aluguel-de-carros-production.up.railway.app']
});
