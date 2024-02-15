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
            WHERE id = UUID_TO_BIN(input_message_id)
        )
        SELECT RowNumber
        INTO offset
        FROM selected_message_row;
    END IF;
	
    SELECT 
        BIN_TO_UUID(m.id) id,
        JSON_OBJECT(
            'id', BIN_TO_UUID(m.id),
            'user_id', BIN_TO_UUID(m.user_id),
            'username', u.username,
            'timestamp', m.timestamp,
            'message', m.content, 
            'visible', m.visible
        ) message
    FROM chat.message m
    JOIN chat.user u ON u.id = m.user_id
    WHERE m.visible = true
    ORDER BY m.timestamp DESC
    LIMIT offset, 20;
    
END//
-- rollback DROP PROCEDURE GetMessages
