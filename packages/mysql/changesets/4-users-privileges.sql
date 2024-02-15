--liquibase formatted sql

-- changeset liquibase:add_rds_user
CREATE USER 'rds_chat_write'@'%' IDENTIFIED WITH AWSAuthenticationPlugin as 'RDS';
-- rollback DROP USER 'rds_chat_write'@'%';

-- changeset liquibase:add_rds_privileges
GRANT ALL PRIVILEGES ON chat.* TO 'rds_chat_write'@'%';
-- rollback REVOKE ALL PRIVILEGES ON *.* FROM 'rds_chat_write'@'%';

