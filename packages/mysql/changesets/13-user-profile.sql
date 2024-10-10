--liquibase formatted sql

-- changeset liquibase:user-profile-table
CREATE TABLE chat.user_profile (
  `id` VARCHAR(36) UNIQUE PRIMARY KEY NOT NULL DEFAULT (UUID()),
  `user_id` VARCHAR(36) NOT NULL UNIQUE,
  `avatar_key` VARCHAR(255) NOT NULL DEFAULT ("users/default/avatar.png")
);
-- rollback DROP TABLE chat.user_profile

-- changeset liquibase:add_foreign_key_user_id_to_user_profile
ALTER TABLE `user_profile` ADD CONSTRAINT `fk__user_profile__user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
-- rollback ALTER TABLE message DROP FOREIGN KEY `fk__user_profile__user_id`;

-- changeset liquibase:existing_users_profile
INSERT INTO chat.user_profile (user_id) SELECT id user_id FROM user;
-- rollback DELETE FROM chat.user_profile