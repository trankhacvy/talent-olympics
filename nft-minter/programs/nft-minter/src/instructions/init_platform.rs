use anchor_lang::prelude::*;

use crate::{
    contants::{DEFAULT_RENTAL_FEE, PLATFORM_SEED, TREASURY_SEED},
    state::Platform,
};

#[derive(Accounts)]
pub struct InitPlatform<'info> {
    #[account(
        init,
        payer = admin,
        seeds = [PLATFORM_SEED.as_bytes()],
        bump,
        space = 8 + Platform::INIT_SPACE
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        seeds = [TREASURY_SEED.as_bytes()],
        bump,
    )]
    treasury: SystemAccount<'info>,

    /// Payer for transaction
    #[account(mut)]
    pub admin: Signer<'info>,

    /// System program
    pub system_program: Program<'info, System>,
}

pub fn init_platform(ctx: Context<InitPlatform>, fee: Option<u64>) -> Result<()> {
    let actual_fee = match fee {
        Some(fee) => fee,
        None => DEFAULT_RENTAL_FEE,
    };

    let platform = &mut ctx.accounts.platform;

    platform.rental_fee = actual_fee;
    platform.treasury = ctx.accounts.treasury.key();

    Ok(())
}
