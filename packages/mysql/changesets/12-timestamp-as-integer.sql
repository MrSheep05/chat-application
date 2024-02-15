--liquibase formatted sql


-- changeset liquibase:remove-messages
DELETE FROM chat.message;
-- rollback empty

-- changeset liquibase:timestamp-as-integer
ALTER TABLE chat.message CHANGE `timestamp` `timestamp` BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP()*1000);
-- rollback DELETE FROM chat.message; ALTER TABLE chat.message CHANGE `timestamp` `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

--changeset liquibase:timestamp-milliseconds-accuracy
ALTER TABLE chat.message CHANGE `timestamp` `timestamp` BIGINT NOT NULL DEFAULT (ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));
-- rollback ALTER TABLE chat.message CHANGE `timestamp` `timestamp` BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP()*1000);
