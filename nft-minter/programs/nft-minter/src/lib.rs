use anchor_lang::prelude::*;

use instructions::*;

pub mod contants;
pub mod errors;
mod instructions;
mod state;

declare_id!("DsE7aWa6rh3P4F2Y8eDdThq4oqzpXeNAroH56wjqyyDC");

#[program]
pub mod nft_minter {
    use super::*;

    pub fn init_platform(ctx: Context<InitPlatform>, fee: Option<u64>) -> Result<()> {
        instructions::init_platform(ctx, fee)
    }

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        name: String,
        symbol: String,
        uri: String,
        seller_fee_basis_points: u16,
    ) -> Result<()> {
        instructions::mint_nft(ctx, name, symbol, uri, seller_fee_basis_points)
    }

    pub fn lock_nft(ctx: Context<Lock>, price: u64) -> Result<()> {
        instructions::lock(ctx, price)
    }

    pub fn unlock_nft(ctx: Context<Unlock>) -> Result<()> {
        instructions::unlock(ctx)
    }

    pub fn swap(ctx: Context<Swap>) -> Result<()> {
        instructions::swap(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
