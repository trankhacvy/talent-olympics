# Marketplace UI

**Description**

This Next.js application provides a user-friendly interface for interacting with the [Marketplace smart contract](https://github.com/ASCorreia/anchor-marketplace) on the Solana blockchain.

**Features**

- Display all listings.
- User can list new NFT.
- User can delist the listing.
- User can purchase NFT from listing.
- Support Blink for each listing

## Video demo

[![Watch the video](https://cdn.loom.com/sessions/thumbnails/d8e3edb6bda5467ab914d70e1e9a21b0-with-play.gif)](https://www.loom.com/share/d8e3edb6bda5467ab914d70e1e9a21b0?sid=10e24eb4-f32a-4052-95d6-2ba45c075acc)

## Try it

Marketplace UI: [https://talent-olympics-marketplace-ui.vercel.app/](https://talent-olympics-marketplace-ui.vercel.app/)

**Getting Started**

1. **Prerequisites:**

   - Node.js and npm (or yarn) installed on your system.
   - A Solana wallet (e.g., Phantom) with some SOL tokens for transaction fees.
   - Basic understanding of Next.js and web development.
   - Familiarity with Solana and smart contracts (recommended).

2. **Clone the repository:**

   ```bash
   git clone git@github.com:trankhacvy/talent-olympics.git
   ```

3. **Install dependencies:**

   ```bash
   cd talent-olympics/marketplace-ui
   npm install (or yarn install)
   ```

4. **Configure environment variables:**

   Create a `.env.local` file at the project root (ignore it with `.gitignore`) and add the following, replacing placeholders with your actual values:

   ```
   NEXT_PUBLIC_HELIUS_API_KEY=0123
   NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_FE_URL=http://localhost:3000
   ```

   - `NEXT_PUBLIC_HELIUS_API_KEY`: Helius API key
   - `NEXT_PUBLIC_RPC_URL`: your RPC.
   - `NEXT_PUBLIC_FE_URL`: Your app URL

5. **Run the application:**

   ```bash
   npm run dev (or yarn dev)
   ```

   This will start the development server, usually accessible at http://localhost:3000 by default.

**License**

This project is licensed under the MIT License (see LICENSE file).
