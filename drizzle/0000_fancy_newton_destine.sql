CREATE TABLE `quote_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`business` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`industry` text NOT NULL,
	`help` text NOT NULL,
	`problem` text NOT NULL,
	`improvement` text NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`timeframe` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
