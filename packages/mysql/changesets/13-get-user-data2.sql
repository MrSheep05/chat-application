--liquibase formatted sql

-- changeset liquibase:add_procedure_get_user_data2 endDelimiter://
CREATE PROCEDURE GetUserData2(IN input_username VARCHAR(20))
BEGIN
    IF input_username IS NULL OR input_username = ''
    THEN
        SIGNAL SQLSTATE '10000' SET MESSAGE_TEXT = 'Username is null or empty', MYSQL_ERRNO = 1001;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM chat.user WHERE username = input_username)
        THEN
            SIGNAL SQLSTATE '10002' SET MESSAGE_TEXT = 'User does not exist', MYSQL_ERRNO = 1001;
        ELSE
 	       SELECT BIN_TO_UUID(id) 'id', username, password FROM chat.user WHERE username = input_username LIMIT 1;
    END IF;
END//
-- rollback DROP PROCEDURE GetUserData2
