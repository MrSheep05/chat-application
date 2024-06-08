--liquibase formatted sql

-- changeset liquibase:get_connections endDelimiter://
CREATE PROCEDURE GetConnections()
BEGIN
   SELECT c.id 'id', uc.user_id 'userId' FROM chat.connection c
   JOIN chat.user_connection uc ON uc.connection_id = c.id
   JOIN chat.user u ON u.id = uc.user_id;
END//
-- rollback DROP PROCEDURE GetConnections
