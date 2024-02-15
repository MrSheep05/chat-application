--liquibase formatted sql

-- changeset liquibase:create_user_table
CREATE TABLE chat.user (
  `id` BINARY(16) UNIQUE PRIMARY KEY NOT NULL DEFAULT (UUID_TO_BIN(UUID(), true)),
  `username` VARCHAR(20) NOT NULL,
  `password` VARCHAR(44) NOT NULL
);
-- rollback DROP TABLE chat.user;

-- changeset liquibase:create_message_table
CREATE TABLE chat.message (
  `id` BINARY(16) UNIQUE PRIMARY KEY NOT NULL DEFAULT (UUID_TO_BIN(UUID(), true)),
  `user_id` BINARY(16) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  `content` TEXT NOT NULL,
  `visible` BOOLEAN NOT NULL DEFAULT true
)
-- rollback DROP TABLE chat.message;

-- changeset liquibase:create_connection_table
CREATE TABLE chat.connection (
  `id` VARCHAR(255) PRIMARY KEY NOT NULL
)
-- rollback DROP TABLE chat.connection;

-- changeset liquibase:create_user_connection_table
CREATE TABLE chat.user_connection (
  `connection_id` VARCHAR(255) NOT NULL,
  `user_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`connection_id`, `user_id`)
)
-- rollback DROP TABLE chat.user_connection;

-- changeset liquibase:create_channel_table
CREATE TABLE chat.channel (
  `id` BINARY(16) PRIMARY KEY NOT NULL DEFAULT (UUID_TO_BIN(UUID(), true)),
  `name` VARCHAR(20) NOT NULL
)
-- rollback DROP TABLE chat.channel;

-- changeset liquibase:create_channel_message_table
CREATE TABLE `chat`.`channel_message` (
  `message_id` BINARY(16) NOT NULL,
  `room_id` BINARY(16) NOT NULL
)
-- rollback DROP TABLE chat.channel_message;

-- changeset liquibase:create_channel_member_table
CREATE TABLE `chat`.`channel_member` (
  `channel_id` BINARY(16) NOT NULL,
  `user_id` BINARY(16) NOT NULL
)
-- rollback DROP TABLE chat.channel_member;
