--liquibase formatted sql

-- changeset liquibase:add_procedure_get_user_data endDelimiter://
CREATE PROCEDURE GetUserData(IN input_username VARCHAR(20), OUT user_data JSON)
BEGIN
    IF input_username IS NULL OR input_username = ''
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Username is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM chat.user WHERE username = input_username)
        THEN
            SIGNAL SQLSTATE '10002' SET MESSAGE_TEXT = 'User does not exist', MYSQL_ERRNO = 1001;
        ELSE
 	       SELECT @id := BIN_TO_UUID(id), @result_username := username, @result_password := password FROM chat.user WHERE username = input_username LIMIT 1;
           SELECT JSON_OBJECT('id', @id, 'username', @result_username, 'password', @result_password) INTO user_data;
    END IF;
END//
-- rollback DROP PROCEDURE GetUserData
