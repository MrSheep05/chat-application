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