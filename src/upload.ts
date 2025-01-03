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

async function getOrCreateCollection(
  database: Db,
  collectionName: string,
): Promise<Collection<Post>> {
  try {
    
    const collection = await database.collection<Post>(collectionName);
    console.log(`Using existing collection ${collection.keyspace}.${collection.collectionName}`);
    return collection;
  } catch (error: any) {
    if (error.message.includes("not found")) {
     
      console.log(`Collection ${collectionName} does not exist. Creating it...`);
      const newCollection = await database.createCollection<Post>(collectionName, {
        vector: {
          service: {
            provider: "nvidia",
            modelName: "NV-Embed-QA",
          },
        },
      });
      console.log(
        `Created collection ${newCollection.keyspace}.${newCollection.collectionName}`
      );
      return newCollection;
    } else {
      throw new Error(`Error retrieving or creating collection: ${error.message}`);
    }
  }
}


(async function () {
  const database = connectToDatabase();

  const collection = await getOrCreateCollection(database, "PostsTesting");

  await uploadJsonData(
    collection,
    "./dataset.json",
    (data) => {
      return `done`;
    },
  );
})();