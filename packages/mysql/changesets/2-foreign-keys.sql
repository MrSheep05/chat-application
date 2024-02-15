--liquibase formatted sql

-- changeset liquibase:add_foreign_key_user_id_to_message
ALTER TABLE `message` ADD CONSTRAINT `fk__message__user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
-- rollback ALTER TABLE message DROP FOREIGN KEY `fk__message__user_id`;

-- changeset liquibase:add_foreign_key_connection_id_to_user_connection
ALTER TABLE `user_connection` ADD CONSTRAINT `fk__user_connection__connection_id` FOREIGN KEY (`connection_id`) REFERENCES `connection` (`id`)
-- rollback ALTER TABLE user_connection DROP FOREIGN KEY `fk__user_connection__connection_id`;

-- changeset liquibase:add_foreign_key_user_id_to_user_connection
ALTER TABLE `user_connection` ADD CONSTRAINT `fk__user_connection__user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
-- rollback ALTER TABLE user_connection DROP FOREIGN KEY `fk__user_connection__user_id`;

-- changeset liquibase:add_foreign_key_message_id_to_channel_message
ALTER TABLE `channel_message` ADD CONSTRAINT `fk__channel_message__message_id` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`)
-- rollback ALTER TABLE channel_message DROP FOREIGN KEY `fk__channel_message__message_id`;

-- changeset liquibase:add_foreign_key_room_id_to_channel_message
ALTER TABLE `channel_message` ADD CONSTRAINT `fk__channel_message__channel_id` FOREIGN KEY (`room_id`) REFERENCES `channel` (`id`)
-- rollback ALTER TABLE channel_message DROP FOREIGN KEY `fk__channel_message__channel_id`;

-- changeset liquibase:add_foreign_key_channel_id_to_channel_member
ALTER TABLE `channel_member` ADD CONSTRAINT `fk__channel_member__channel_id` FOREIGN KEY (`channel_id`) REFERENCES `channel` (`id`)
-- rollback ALTER TABLE channel_member DROP FOREIGN KEY `fk__channel_member__channel_id`;

-- changeset liquibase:add_foreign_key_user_id_to_channel_member
ALTER TABLE `channel_member` ADD CONSTRAINT `fk__channel_member__user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
-- rollback ALTER TABLE channel_member DROP FOREIGN KEY fk__channel_member__user_id;
