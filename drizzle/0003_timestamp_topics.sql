PRAGMA foreign_keys=OFF;--> statement-breakpoint
DROP TABLE IF EXISTS `__new_topics`;--> statement-breakpoint
CREATE TABLE `__new_topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`text` text NOT NULL,
	`publish_start_at` TIMESTAMP,
	`publish_end_at` TIMESTAMP,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_topics`("id", "title", "text", "publish_start_at", "publish_end_at", "created_at", "updated_at", "deleted_at")
  SELECT "id", "title", "text",
         CASE WHEN "publish_start_at" IS NOT NULL THEN datetime("publish_start_at") ELSE NULL END,
         CASE WHEN "publish_end_at" IS NOT NULL THEN datetime("publish_end_at") ELSE NULL END,
         CASE WHEN "created_at" IS NOT NULL THEN datetime("created_at") ELSE NULL END,
         CASE WHEN "updated_at" IS NOT NULL THEN datetime("updated_at") ELSE NULL END,
         CASE WHEN "deleted_at" IS NOT NULL THEN datetime("deleted_at") ELSE NULL END
  FROM `topics`;--> statement-breakpoint
DROP TABLE `topics`;--> statement-breakpoint
ALTER TABLE `__new_topics` RENAME TO `topics`;--> statement-breakpoint
PRAGMA foreign_keys=ON;

