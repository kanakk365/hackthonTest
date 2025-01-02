import { connectToDatabase, Post } from "./connect";
import { Db, Collection } from "@datastax/astra-db-ts";
import fs from "fs";



const run = async ()=> {
  const database = connectToDatabase();
  const collection = database.collection("PostsTesting");

  const carousel = await collection.findOne({
    _id: "6b56e995-b314-4245-96e9-95b314d245e5",
  });
  const staticImage = await collection.findOne({
    _id: "503f9932-3cb1-418b-bf99-323cb1a18b4a",
  });
  const carousel2 = await collection.findOne({
    _id: "43609fa9-1f90-48de-a09f-a91f9018de82",
  });
  const staticImage2 = await collection.findOne({
    _id: "4eb944bf-36a0-437e-b944-bf36a0437ed0",
  });
  const carousel4 = await collection.findOne({
    _id: "d8cb9c64-8211-42ce-8b9c-64821112cef3",
  });
  const carousel3 = await collection.findOne({
    _id: "1cf14fa7-b5b4-4230-b14f-a7b5b4723032",
  });

  return { carousel , carousel2 ,carousel3, carousel4 ,staticImage, staticImage2  }
};


export default run