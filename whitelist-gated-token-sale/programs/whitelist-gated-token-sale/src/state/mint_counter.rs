use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace, Default)]
pub struct MintCounter {
    pub minted: u64,
}
