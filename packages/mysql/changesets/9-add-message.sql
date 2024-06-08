--liquibase formatted sql

-- changeset liquibase:add_default_timestamp
ALTER TABLE chat.message CHANGE `timestamp` `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- rollback ALTER TABLE chat.message ALTER timestamp DROP DEFAULT

-- changeset liquibase:add_message endDelimiter://
CREATE PROCEDURE AddMessage(IN input_user_id VARCHAR(36), IN input_content TEXT)
BEGIN
    IF input_user_id IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'User id is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    IF input_content IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Content is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    SET @id = UUID();

    INSERT INTO chat.message (id, user_id, content) VALUES (@id, input_user_id, input_content);
    
    SELECT  m.id 'id',
            m.user_id 'userId',
            u.username 'username',
            m.timestamp 'timestamp',
            m.content 'message', 
            m.visible 'visible'
    FROM chat.message m
    JOIN chat.user u ON u.id = m.user_id
    WHERE m.id = @id;
END//
-- rollback DROP PROCEDURE AddMessage
