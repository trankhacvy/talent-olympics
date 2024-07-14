use anchor_lang::prelude::*;

use crate::constants::CONFIG_SEED;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub root: [u8; 32],

    pub token_price: u64,

    pub limit_per_wallet: u64,

    pub bump: [u8; 1],
}

impl Config {
    pub fn seeds(&self) -> [&[u8]; 2] {
        [CONFIG_SEED.as_ref(), self.bump.as_ref()]
    }
}
