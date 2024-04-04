--liquibase formatted sql
-- changeset liquibase:add_message2 endDelimiter://
CREATE PROCEDURE AddMessage2(IN input_user_id VARCHAR(36), IN input_content TEXT)
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
    
    SELECT  BIN_TO_UUID(m.id) 'id',
            BIN_TO_UUID(m.user_id) 'user_id',
            u.username 'username',
            m.timestamp 'timestamp',
            m.content 'content', 
            m.visible 'visible'
    FROM chat.message m
    JOIN chat.user u ON u.id = m.user_id
    WHERE m.id = @id;
END//
-- rollback DROP PROCEDURE AddMessage2
