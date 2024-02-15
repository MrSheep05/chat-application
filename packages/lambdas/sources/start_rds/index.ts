import { StartDBInstanceCommand, RDSClient } from "@aws-sdk/client-rds";

const { databaseInstanceIdentifier } = process.env;

export const handler = async (event) => {
  console.info("Event:", event);

  try {
    const client = new RDSClient({
      region: "eu-west-2",
    });

    const command = new StartDBInstanceCommand({
      DBInstanceIdentifier: databaseInstanceIdentifier,
    });

    const result = await client.send(command);

    console.log("result", result);

    return { statusCode: 200 };
  } catch (error) {
    console.log("Unable to start the database instance:", error);
    return { statusCode: 500 };
  }
};
