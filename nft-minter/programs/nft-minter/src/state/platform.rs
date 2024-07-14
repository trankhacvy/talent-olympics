use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Platform {
    pub rental_fee: u64,

    pub treasury: Pubkey,
}
