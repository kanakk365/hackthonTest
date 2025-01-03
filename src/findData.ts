import { connectToDatabase, Post } from "./connect";
import { Db, Collection } from "@datastax/astra-db-ts";
import fs from "fs";



const run = async ()=> {
  const database = connectToDatabase();
  const collection = database.collection("PostsTesting");

  const allPostsCursor = await collection.find({});
  const allPosts = await allPostsCursor.toArray();
  // console.log(allPostsCursor)
  // console.log(allPosts)
  return { allPosts}
  
};
run()


export default run