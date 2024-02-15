--liquibase formatted sql

-- changeset liquibase:remove_connection endDelimiter://
CREATE PROCEDURE RemoveConnection(IN input_connection_id varchar(255))
BEGIN
    IF input_connection_id IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Connection id is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    DELETE FROM chat.user_connection WHERE connection_id = input_connection_id;
    DELETE FROM chat.connection WHERE id = input_connection_id;
END//
-- rollback DROP PROCEDURE RemoveConnection