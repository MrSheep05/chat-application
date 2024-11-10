import { Signer } from "@aws-sdk/rds-signer";
import mysql, { Connection } from "mysql2";

const DATABASE_HOST = "tprzytula.c9d131dccpig.eu-west-2.rds.amazonaws.com";
const DATABASE_PORT = 3306;
const REGION = "eu-west-2";
const USERNAME = "rds_chat_write";

const signer = new Signer({
  region: REGION,
  hostname: DATABASE_HOST,
  port: DATABASE_PORT,
  username: USERNAME,
});

export const connect = (): Promise<Connection> => {
  return new Promise(async (resolve, reject) => {
    const token = await signer.getAuthToken();
    const connection = mysql.createConnection({
      host: DATABASE_HOST,
      user: USERNAME,
      database: "chat",
      ssl: "Amazon RDS",
      password: token,
      multipleStatements: true,
    });

    connection.connect((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(connection);
    });
  });
};
