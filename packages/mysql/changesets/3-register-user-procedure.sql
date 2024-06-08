--liquibase formatted sql

-- changeset liquibase:add_procedure_register_user endDelimiter://
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
        INSERT INTO chat.user (username, password) VALUES (input_username, input_password);
        SELECT ROW_COUNT() 'updateCount';
    END IF;
END //
-- rollback DROP PROCEDURE RegisterUser

