use anchor_lang::prelude::*;

use instructions::*;

mod constants;
mod errors;
mod instructions;
mod state;
mod utils;

declare_id!("GBTyYgyndirv9GVDiLsD1Ym7Z2PSLG5Ffm2maN5UWEhi");

#[program]
pub mod whitelist_gated_token_sale {

    use super::*;

    pub fn init_distributor(
        ctx: Context<InitDistributor>,
        root: [u8; 32],
        token_price: u64,
        limit_per_wallet: u64,
        token_name: String,
        token_symbol: String,
        uri: String,
    ) -> Result<()> {
        instructions::init_distributor(
            ctx,
            root,
            token_price,
            limit_per_wallet,
            token_name,
            token_symbol,
            uri,
        )
    }

    pub fn mint_token(ctx: Context<MintToken>, proof: Vec<[u8; 32]>, amount: u64) -> Result<()> {
        instructions::mint_token(ctx, proof, amount)
    }
}
