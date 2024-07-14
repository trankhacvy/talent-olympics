# Solana Escrow UI

**Description**

This Next.js application provides a user-friendly interface for interacting with the [Anchor Escrow smart contract](https://github.com/deanmlittle/anchor-escrow-2024) on the Solana blockchain.

**Features**

- Display all active escrows.
- Maker can create new escrow.
- Maker can close the escrow and get the deposit back.
- Taker can take the escrow.
- Display total escrow and total value locked
- Support Blink for each escrow

## Video demo

[![Watch the video](https://cdn.loom.com/sessions/thumbnails/c4c88127ccff4da0b17cd01fae4bd38d-with-play.gif)](https://www.loom.com/share/c4c88127ccff4da0b17cd01fae4bd38d?sid=500544fb-fa78-4a7f-b246-1eca6b303905)

## Try it

Escrow UI: [https://talent-olympics-escrow-ui.vercel.app/](https://talent-olympics-escrow-ui.vercel.app/)

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
   cd talent-olympics/escrow-ui-blink
   npm install (or yarn install)
   ```

4. **Configure environment variables:**

   Create a `.env.local` file at the project root (ignore it with `.gitignore`) and add the following, replacing placeholders with your actual values:

   ```
   NEXT_PUBLIC_RPC_URL=devnet (or mainnet-beta)
   NEXT_PUBLIC_FE_URL=http://localhost:3000
   ```

   - `NEXT_PUBLIC_RPC_URL`: your RPC.
   - `NEXT_PUBLIC_FE_URL`: Your app URL

5. **Run the application:**

   ```bash
   npm run dev (or yarn dev)
   ```

   This will start the development server, usually accessible at http://localhost:3000 by default.

**License**

This project is licensed under the MIT License (see LICENSE file).
