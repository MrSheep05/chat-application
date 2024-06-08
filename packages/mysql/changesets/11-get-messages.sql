--liquibase formatted sql

-- changeset liquibase:get_messages endDelimiter://
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
        m.visible 'visible'
    FROM chat.message m
    JOIN chat.user u ON u.id = m.user_id
    WHERE m.visible = true
    ORDER BY m.timestamp DESC
    LIMIT offset, 20;
END//
-- rollback DROP PROCEDURE GetMessages
