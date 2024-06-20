--liquibase formatted sql

-- changeset liquibase:add_procedure_get_user_data endDelimiter://
CREATE PROCEDURE GetUserData(IN input_username VARCHAR(20), IN input_connection_id VARCHAR(255))
BEGIN
    IF (input_username IS NULL OR input_username = '') AND (input_connection_id IS NULL OR input_connection_id = '')
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Either username or connection id is required', MYSQL_ERRNO = 1001;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM chat.user u LEFT JOIN chat.user_connection uc ON uc.user_id = u.id
        WHERE 
            CASE WHEN input_username IS NOT NULL AND input_username != '' 
            THEN u.username = input_username ELSE 1=1 END 
            AND CASE WHEN input_connection_id IS NOT NULL AND input_connection_id != '' 
            THEN uc.connection_id = input_connection_id ELSE 1=1 END 
    )
    THEN
        SIGNAL SQLSTATE '10002' SET MESSAGE_TEXT = 'User does not exist', MYSQL_ERRNO = 1001;
    END IF;

    SELECT id, username, password FROM chat.user u
    LEFT JOIN chat.user_connection uc ON uc.user_id = u.id
    WHERE 
    CASE WHEN input_username IS NOT NULL AND input_username != '' 
    THEN u.username = input_username ELSE 1=1 END 
    AND CASE WHEN input_connection_id IS NOT NULL AND input_connection_id != '' 
    THEN uc.connection_id = input_connection_id ELSE 1=1 END 
    LIMIT 1;

END//
-- rollback DROP PROCEDURE GetUserData
