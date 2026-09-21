import { env } from 'cloudflare:workers';
export function quoteDatabase():D1Database {
 if(!env.DB)throw new Error('Quote storage unavailable');
 return env.DB;
}
