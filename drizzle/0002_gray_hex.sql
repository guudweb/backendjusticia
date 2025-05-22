CREATE TABLE `libros` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descripcion` text NOT NULL,
	`autor` text NOT NULL,
	`portada` text,
	`archivo` text,
	`slug` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `libros_slug_unique` ON `libros` (`slug`);