import { DataAPIClient, Db, VectorizeDoc } from "@datastax/astra-db-ts";
import dotenv from "dotenv";


dotenv.config()

/**
 * Connects to a DataStax Astra database.
 * This function retrieves the database endpoint and application token from the
 * environment variables `ASTRA_DB_API_ENDPOINT` and `ASTRA_DB_APPLICATION_TOKEN`.
 *
 * @returns An instance of the connected database.
 * @throws Will throw an error if the environment variables
 * `ASTRA_DB_API_ENDPOINT` or `ASTRA_DB_APPLICATION_TOKEN` are not defined.
 */
export function connectToDatabase(): Db {
  const { ASTRA_DB_API_ENDPOINT: endpoint, ASTRA_DB_APPLICATION_TOKEN: token } =
    process.env;

  if (!token || !endpoint) {
    throw new Error(
      "Environment variables ASTRA_DB_API_ENDPOINT and ASTRA_DB_APPLICATION_TOKEN must be defined.",
    );
  }

  // Create an instance of the `DataAPIClient` class with your token.
  const client = new DataAPIClient(token);

  // Get the database specified by your endpoint.
  const database = client.db(endpoint);

  console.log(`Connected to database ${database.id}`);
  

  return database;
}

// You can define interfaces that describe the shape of your data.
// The VectorizeDoc interface adds a $vectorize key.
export interface Post extends VectorizeDoc {
  post_type: string;
  likes: number;
  shares: number;
  comments: number;
}