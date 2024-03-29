--liquibase formatted sql

-- changeset liquibase:add_default_timestamp
ALTER TABLE chat.message CHANGE `timestamp` `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- rollback ALTER TABLE chat.message ALTER timestamp DROP DEFAULT

-- changeset liquibase:add_message endDelimiter://
CREATE PROCEDURE AddMessage(IN input_user_id VARCHAR(36), IN input_content TEXT, OUT message_data JSON)
BEGIN
    IF input_user_id IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'User id is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    IF input_content IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Content is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    SET @id = (UUID_TO_BIN(UUID(), true));

    INSERT INTO chat.message (id, user_id, content) VALUES (@id, UUID_TO_BIN(input_user_id), input_content);
    
    SELECT JSON_OBJECT(
        'id', BIN_TO_UUID(m.id),
        'user_id', BIN_TO_UUID(m.user_id),
        'username', u.username,
        'timestamp', m.timestamp,
        'message', m.content, 
        'visible', m.visible
    )
    FROM chat.message m
    JOIN chat.user u ON u.id = m.user_id
    WHERE m.id = @id 
    INTO message_data;
END//
-- rollback DROP PROCEDURE AddMessage
