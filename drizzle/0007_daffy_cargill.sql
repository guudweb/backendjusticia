ALTER TABLE libros ADD `tags` text;--> statement-breakpoint
ALTER TABLE libros ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `libros_slug_unique` ON `libros` (`slug`);--> statement-breakpoint
ALTER TABLE `libros` DROP COLUMN `tag`;