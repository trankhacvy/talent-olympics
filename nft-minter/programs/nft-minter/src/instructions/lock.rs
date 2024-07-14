use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer as SplTransfer},
};

use crate::{
    contants::{NFT_VAULT_SEED, PLATFORM_SEED, TREASURY_SEED},
    state::{Platform, Vault},
};

#[derive(Accounts)]
pub struct Lock<'info> {
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = maker
    )]
    pub nft_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = maker,
        seeds = [NFT_VAULT_SEED.as_bytes(), nft_mint.key().as_ref()],
        bump,
        space = 8 + Vault::INIT_SPACE
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        init,
        payer = maker,
        associated_token::mint = nft_mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [PLATFORM_SEED.as_bytes()],
        bump,
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        mut,
        seeds = [TREASURY_SEED.as_bytes()],
        bump,
    )]
    pub treasury: SystemAccount<'info>,

    /// Payer for transaction
    #[account(mut)]
    pub maker: Signer<'info>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Token program
    pub token_program: Program<'info, Token>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn lock(ctx: Context<Lock>, price: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;

    vault.nft = ctx.accounts.nft_mint.key();
    vault.maker = ctx.accounts.maker.key();
    vault.price = price;

    //move nft into vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SplTransfer {
                from: ctx.accounts.nft_token_account.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.maker.to_account_info(),
            },
        ),
        1,
    )?;

    // charge rental fee
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.maker.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
        ),
        ctx.accounts.platform.rental_fee,
    )?;

    Ok(())
}
