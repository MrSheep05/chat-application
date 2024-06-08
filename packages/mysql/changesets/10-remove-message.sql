--liquibase formatted sql

-- changeset liquibase:remove_message endDelimiter://
CREATE PROCEDURE RemoveMessage(IN input_connection_id VARCHAR(255), IN input_message_id VARCHAR(36))
BEGIN
    IF input_connection_id IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Connection id is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    IF input_message_id IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Message id is null or empty', MYSQL_ERRNO = 1001;
    END IF;
    
    UPDATE chat.message   
    SET visible = false
    WHERE user_id IN (
        SELECT user_id
        FROM chat.user_connection
        WHERE connection_id = input_connection_id
    )
    AND id = input_message_id;

    SELECT ROW_COUNT() 'updateCount';
END//
-- rollback DROP PROCEDURE RemoveMessage
