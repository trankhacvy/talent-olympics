import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { connection } from "./connection";
import { Keypair } from "@solana/web3.js";

export async function prepareTransaction(
  instructions: TransactionInstruction[],
  payer: PublicKey
) {
  const blockhash = await connection
    .getLatestBlockhash()
    .then((res) => res.blockhash);

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  const reference = Keypair.generate();

  return new VersionedTransaction(messageV0);
}
