import { MongoClient, Db } from 'mongodb';

interface ConnectType {
  db: Db;
  client: MongoClient;
}

const client = new MongoClient(process.env.DATABASE_URL);

export default async function connectDb(): Promise<ConnectType> {
  await client.connect();

  const db = client.db('professorSchedule');
  return { db, client };
}
