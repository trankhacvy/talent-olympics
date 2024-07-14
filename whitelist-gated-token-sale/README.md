# Solana Whitelist-gated Token Sale

**Description**

This project implements a Solana smart contract, written in Rust using the Anchor framework, to facilitate a whitelist-gated token sale for a new token. Participants must be whitelisted to purchase tokens. The program enforces a static token price and a purchase limit per wallet address for a fair and controlled sale.

**Features**

- Only whitelisted users can mint tokens.
- Use a Merkle tree to minimize the cost of storing whitelisted wallet addresses on-chain.
- Admins retain the ability to update the whitelist (Merkle root), token price, and limit the number of tokens minted per wallet.
- Supports minting tokens through Blink.

## Video demo

[![Watch the video](https://cdn.loom.com/sessions/thumbnails/eb42a9b85ad34d06a74fd7a73ae21898-with-play.gif)](https://www.loom.com/share/eb42a9b85ad34d06a74fd7a73ae21898?sid=2e2bcaa0-a3d3-4f15-a8e0-7bed60f0139e)

## Try the Blink

[Whitelist-gated token sale Blink](https://dial.to/?action=solana-action:https://talent-olympics-token-sale.vercel.app/api/mint)

## Getting Started

1. **Prerequisites:**

   - Node.js: https://nodejs.org/en
   - Anchor: https://docs.anchorprotocol.com/
   - Solana CLI: https://docs.solanalabs.com/cli/install
   - Rust: https://www.rust-lang.org/tools/install
   - A Solana developer account with sufficient SOL for transaction fees.

2. **Clone the repository:**

   ```bash
   git clone git@github.com:trankhacvy/talent-olympics.git
   ```

3. **Install dependencies:**

   ```bash
   cd talent-olympics/whitelist-gated-token-sale
   npm install (or yarn install)
   ```

4. **Test the application:**

   ```bash
   anchor test
   ```

**License**

This project is licensed under the MIT License (see LICENSE file).
