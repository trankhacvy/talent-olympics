use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub nft: Pubkey,

    pub maker: Pubkey,

    pub price: u64,
}