import { connectToDatabase, Post } from "./connect";
import { Db, Collection } from "@datastax/astra-db-ts";
import fs from "fs";


async function createCollection(
  database: Db,
  collectionName: string,
): Promise<Collection<Post>> {
  const collection = await database.createCollection<Post>(collectionName, {
    vector: {
      service: {
        provider: "nvidia",
        modelName: "NV-Embed-QA",
      },
    },
  });

  console.log(
    `Created collection ${collection.keyspace}.${collection.collectionName}`,
  );

  return collection;
}


async function uploadJsonData(
  collection: Collection<Post>,
  dataFilePath: string,
  embeddingStringCreator: (data: Record<string, any>) => string,
): Promise<void> {
  
  const rawData = fs.readFileSync(dataFilePath, "utf8");
  const jsonData = JSON.parse(rawData);

 
  const documents: Post[] = jsonData.map((data: any) => ({
    ...data,
    $vectorize: embeddingStringCreator(data),
  }));

 
  const inserted = await collection.insertMany(documents);
  console.log(`Inserted ${inserted.insertedCount} items.`);
}

(async function () {
  const database = connectToDatabase();

  const collection = await createCollection(
    database,
    "PostsTesting",
  );

  await uploadJsonData(
    collection,
    "./dataset.json",
    (data) => {
      return `done`;
    },
  );
})();