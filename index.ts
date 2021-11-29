import * as IPFS from "ipfs-http-client";
import OrbitDb from "orbit-db";
import { config } from "dotenv";
import ChatClient, { MessagePayload } from "./client";
import { Handler } from "./handler";
import "reflect-metadata";

config();

async function main() {
  const ipfs = IPFS.create({
    host: process.env.IPFS_HOST,
    port: Number(process.env.IPFS_PORT),
    protocol: process.env.IFPS_PROTOCOL,
  });

  const orbitdb = await OrbitDb.createInstance(ipfs as never);

  const db = await orbitdb.log<MessagePayload>(process.env.DATABASE || "bot", {
    accessController: {
      write: ["*"],
    },
  });

  console.log(`Address: ${db.address}`);

  const client = new ChatClient(process.env.NICKNAME || "IPFS Bot", db);

  new Handler(client).build();
}

main();
