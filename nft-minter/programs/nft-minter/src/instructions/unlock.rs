use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer as SplTransfer},
};

use crate::{contants::NFT_VAULT_SEED, state::Vault};

#[derive(Accounts)]
pub struct Unlock<'info> {
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = nft_mint,
        associated_token::authority = payer
    )]
    pub nft_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [NFT_VAULT_SEED.as_bytes(), nft_mint.key().as_ref()],
        bump,
        constraint = vault.maker == payer.key(),
        constraint = vault.nft == nft_mint.key(),
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    /// Payer for transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Token program
    pub token_program: Program<'info, Token>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn unlock(ctx: Context<Unlock>) -> Result<()> {
    let nft_mint_key = &ctx.accounts.nft_mint.key();
    let bump_vecs = ctx.bumps.vault.to_be_bytes();
    let nft_mint_key_vecs = nft_mint_key.as_ref();

    let inner = vec![
        NFT_VAULT_SEED.as_bytes(),
        nft_mint_key_vecs,
        bump_vecs.as_ref(),
    ];
    let outer = vec![inner.as_slice()];

    //move nft into owner
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            SplTransfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.nft_token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            outer.as_slice(),
        ),
        1,
    )?;

    Ok(())
}
