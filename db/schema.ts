import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const quoteRequests=sqliteTable('quote_requests',{
 id:text('id').primaryKey(), name:text('name').notNull(), business:text('business').notNull(),
 email:text('email').notNull(), phone:text('phone').notNull(), industry:text('industry').notNull(),
 help:text('help').notNull(), problem:text('problem').notNull(), improvement:text('improvement').notNull(),
 budget:text('budget').notNull().default(''), timeframe:text('timeframe').notNull().default(''),
 createdAt:integer('created_at').notNull(),
});
