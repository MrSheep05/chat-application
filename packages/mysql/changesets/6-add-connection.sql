--liquibase formatted sql

-- changeset liquibase:add_connection endDelimiter://
CREATE PROCEDURE AddConnection(IN input_user_id varchar(36), IN input_connection_id varchar(255))
BEGIN
    IF input_user_id IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'User id is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    IF input_connection_id IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Connection id is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    INSERT INTO chat.connection (id) VALUES (input_connection_id);
    INSERT INTO chat.user_connection (connection_id, user_id) VALUES (input_connection_id, UUID_TO_BIN(input_user_id));
END//
-- rollback DROP PROCEDURE AddConnection