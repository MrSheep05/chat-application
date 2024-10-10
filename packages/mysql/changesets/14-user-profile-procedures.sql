--liquibase formatted sql

-- changeset liquibase:replace_procedure_register_user endDelimiter:// rollbackEndDelimiter://
DROP PROCEDURE RegisterUser //

CREATE PROCEDURE RegisterUser(IN input_username VARCHAR(20), IN input_password VARCHAR(44))
BEGIN
    IF input_username IS NULL OR input_username = ''
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Username is null or empty', MYSQL_ERRNO = 1001;
    END IF;
    
    IF input_password IS NULL OR input_password = ''
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Password is null or empty', MYSQL_ERRNO = 1001;
    END IF;
    
    IF EXISTS (SELECT username FROM chat.user WHERE username = input_username)
    THEN
        SIGNAL SQLSTATE '10001' SET MESSAGE_TEXT = 'User already exists', MYSQL_ERRNO = 1001;
    ELSE
        SET @id = UUID();
        INSERT INTO chat.user (id,username, password) VALUES (@id,input_username, input_password);
        SET @updated_rows = ROW_COUNT();
        INSERT INTO chat.user_profile (user_id) VALUES (@id);
        SELECT @updated_rows 'updatedCount';
    END IF;
END //

-- rollback DROP PROCEDURE RegisterUser //
-- rollback CREATE PROCEDURE RegisterUser(IN input_username VARCHAR(20), IN input_password VARCHAR(44))
-- rollback BEGIN
-- rollback     IF input_username IS NULL OR input_username = ''
-- rollback     THEN
-- rollback          SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Username is null or empty', MYSQL_ERRNO = 1001;
-- rollback     END IF;
-- rollback     
-- rollback     IF input_password IS NULL OR input_password = ''
-- rollback     THEN
-- rollback         SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Password is null or empty', MYSQL_ERRNO = 1001;
-- rollback     END IF;
-- rollback     
-- rollback     IF EXISTS (SELECT username FROM chat.user WHERE username = input_username)
-- rollback     THEN
-- rollback         SIGNAL SQLSTATE '10001' SET MESSAGE_TEXT = 'User already exists', MYSQL_ERRNO = 1001;
-- rollback     ELSE
-- rollback         INSERT INTO chat.user (username, password) VALUES (input_username, input_password);
-- rollback         SELECT ROW_COUNT() 'updateCount';
-- rollback     END IF;
-- rollback END //

-- changeset liquibase:add_procedure_update_profile_avatar endDelimiter://
CREATE PROCEDURE UpdateUserProfileAvatar(IN input_user_id VARCHAR(36), IN input_avatar_key VARCHAR(255))
BEGIN
     IF input_user_id IS NULL
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'User id is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    IF input_avatar_key IS NULL OR input_avatar_key = ''
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Avatar key is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    UPDATE chat.user_profile SET avatar_key = input_avatar_key WHERE user_id = input_user_id;
    SELECT ROW_COUNT() 'updateCount';
END //
-- rollback DROP PROCEDURE UpdateUserProfileAvatar

-- changeset liquibase:replace_procedure_add_message endDelimiter:// rollbackEndDelimiter://
DROP PROCEDURE AddMessage //
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
            m.visible 'visible',
            up.avatar_key 'avatarKey'
    FROM chat.message m
    JOIN chat.user u ON u.id = m.user_id
    JOIN chat.user_profile up ON u.id = up.user_id
    WHERE m.id = @id;
END//

-- rollback DROP PROCEDURE AddMessage //
-- rollback CREATE PROCEDURE AddMessage(IN input_user_id VARCHAR(36), IN input_content TEXT)
-- rollback BEGIN
-- rollback     IF input_user_id IS NULL
-- rollback     THEN
-- rollback         SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'User id is null or empty', MYSQL_ERRNO = 1001;
-- rollback     END IF;
-- rollback 
-- rollback     IF input_content IS NULL
-- rollback     THEN
-- rollback         SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Content is null or empty', MYSQL_ERRNO = 1001;
-- rollback     END IF;
-- rollback 
-- rollback     SET @id = UUID();
-- rollback 
-- rollback     INSERT INTO chat.message (id, user_id, content) VALUES (@id, input_user_id, input_content);
-- rollback     
-- rollback     SELECT  m.id 'id',
-- rollback             m.user_id 'userId',
-- rollback             u.username 'username',
-- rollback             m.timestamp 'timestamp',
-- rollback             m.content 'message', 
-- rollback             m.visible 'visible'
-- rollback     FROM chat.message m
-- rollback     JOIN chat.user u ON u.id = m.user_id
-- rollback     WHERE m.id = @id;
-- rollback END//

-- changeset liquibase:replace_procedure_get_messages endDelimiter:// rollbackEndDelimiter://
DROP PROCEDURE GetMessages //
CREATE PROCEDURE GetMessages(IN input_message_id VARCHAR(36))
BEGIN
	DECLARE offset BIGINT DEFAULT 0;

    IF input_message_id != 'null'
    THEN
        WITH all_message_rows AS (
            SELECT ROW_NUMBER() OVER (ORDER BY timestamp DESC) AS RowNumber, id
            FROM chat.message
        ), selected_message_row AS (
            SELECT RowNumber
            FROM all_message_rows
            WHERE id = input_message_id
        )
        SELECT RowNumber
        INTO offset
        FROM selected_message_row;
    END IF;
	
    SELECT  
        m.id 'id',
        m.user_id 'user_id',
        u.username 'username',
        m.timestamp 'timestamp',
        m.content 'message',
        m.visible 'visible',
        up.avatar_key 'avatarKey'
    FROM chat.message m
    JOIN chat.user u ON u.id = m.user_id
    JOIN chat.user_profile up ON u.id = up.user_id
    WHERE m.visible = true
    ORDER BY m.timestamp DESC
    LIMIT offset, 20;
END//

-- rollback DROP PROCEDURE GetMessages //
-- rollback CREATE PROCEDURE GetMessages(IN input_message_id VARCHAR(36))
-- rollback BEGIN
-- rollback 	DECLARE offset BIGINT DEFAULT 0;
-- rollback 
-- rollback     IF input_message_id != 'null'
-- rollback     THEN
-- rollback         WITH all_message_rows AS (
-- rollback             SELECT ROW_NUMBER() OVER (ORDER BY timestamp DESC) AS RowNumber, id
-- rollback             FROM chat.message
-- rollback         ), selected_message_row AS (
-- rollback             SELECT RowNumber
-- rollback             FROM all_message_rows
-- rollback             WHERE id = input_message_id
-- rollback         )
-- rollback         SELECT RowNumber
-- rollback         INTO offset
-- rollback         FROM selected_message_row;
-- rollback     END IF;
-- rollback 	
-- rollback     SELECT  
-- rollback         m.id 'id',
-- rollback         m.user_id 'user_id',
-- rollback         u.username 'username',
-- rollback         m.timestamp 'timestamp',
-- rollback         m.content 'message',
-- rollback         m.visible 'visible'
-- rollback     FROM chat.message m
-- rollback     JOIN chat.user u ON u.id = m.user_id
-- rollback     WHERE m.visible = true
-- rollback     ORDER BY m.timestamp DESC
-- rollback     LIMIT offset, 20;
-- rollback END//