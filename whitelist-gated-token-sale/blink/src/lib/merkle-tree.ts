import { MerkleTree } from "merkletreejs";
import { keccak_256 } from "@noble/hashes/sha3";

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
