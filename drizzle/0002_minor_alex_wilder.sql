PRAGMA foreign_keys=OFF;--> statement-breakpoint
DROP TABLE IF EXISTS `__new_todos`;--> statement-breakpoint
CREATE TABLE `__new_todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_todos`("id", "title", "completed", "created_at", "updated_at", "deleted_at")
  SELECT "id", "title", "completed",
         datetime("created_at" / 1000, 'unixepoch'),
         datetime("updated_at" / 1000, 'unixepoch'),
         NULL
  FROM `todos`;--> statement-breakpoint
DROP TABLE `todos`;--> statement-breakpoint
ALTER TABLE `__new_todos` RENAME TO `todos`;--> statement-breakpoint
DROP TABLE IF EXISTS `__new_topics`;--> statement-breakpoint
CREATE TABLE `__new_topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`text` text NOT NULL,
	`publish_start_at` text,
	`publish_end_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_topics`("id", "title", "text", "publish_start_at", "publish_end_at", "created_at", "updated_at", "deleted_at")
  SELECT "id", "title", "text", "publish_start_at", "publish_end_at",
         datetime("created_at" / 1000, 'unixepoch'),
         datetime("updated_at" / 1000, 'unixepoch'),
         NULL
  FROM `topics`;--> statement-breakpoint
DROP TABLE `topics`;--> statement-breakpoint
ALTER TABLE `__new_topics` RENAME TO `topics`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
