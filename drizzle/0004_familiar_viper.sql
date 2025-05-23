ALTER TABLE libros ADD `categoria` text;--> statement-breakpoint
ALTER TABLE libros ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `libros_slug_unique` ON `libros` (`slug`);