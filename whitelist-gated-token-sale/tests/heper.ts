import { MerkleTree } from "merkletreejs";
import { keccak_256 } from "@noble/hashes/sha3";
import { Keypair, PublicKey } from "@solana/web3.js";

type MerkleTreeInput = Uint8Array | string;

export const getMerkleTree = (data: MerkleTreeInput[]): MerkleTree => {
  return new MerkleTree(data.map(keccak_256), keccak_256, {
    sortPairs: true,
  });
};

export const getMerkleRoot = (data: MerkleTreeInput[]): Uint8Array => {
  return getMerkleTree(data).getRoot();
};

export const getMerkleProof = (
  data: MerkleTreeInput[],
  leaf: MerkleTreeInput,
  index?: number
): Uint8Array[] => {
  return getMerkleTree(data)
    .getProof(Buffer.from(keccak_256(leaf)), index)
    .map((proofItem) => proofItem.data);
};

export const tokenMint = Keypair.generate();

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const allowAddresses = [
  "63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs",
  "5AHKzmDcjeAAnafTivi5u7dWYw3jUQh2VBRDzSd9ztVr",
  "CDXLgstdVZJ7qUh3DC1mAGuCmTM3UiS1M24m44t3UViS",
  "3hZu5KH5CSAtnfERxbKnFMTRy1VwPkyEphkm2PRfZjTB",
  "6Bs6sz85RQtBVRsnsH11qSxmuR326S5jguEQVK7T73NJ",
];
