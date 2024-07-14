use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer as SplTransfer},
};

use crate::{contants::NFT_VAULT_SEED, state::Vault};

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = nft_mint,
        associated_token::authority = taker
    )]
    pub nft_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [NFT_VAULT_SEED.as_bytes(), nft_mint.key().as_ref()],
        bump,
        constraint = vault.nft == nft_mint.key(),
        close = maker
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
    pub taker: Signer<'info>,

    #[account(mut)]
    pub maker: SystemAccount<'info>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Token program
    pub token_program: Program<'info, Token>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn swap(ctx: Context<Swap>) -> Result<()> {
    let nft_mint_key = &ctx.accounts.nft_mint.key();
    let bump_vecs = ctx.bumps.vault.to_be_bytes();
    let nft_mint_key_vecs = nft_mint_key.as_ref();

    let inner = vec![
        NFT_VAULT_SEED.as_bytes(),
        nft_mint_key_vecs,
        bump_vecs.as_ref(),
    ];
    let outer = vec![inner.as_slice()];

    // transfer nft into taker
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

    // Transfer SOL from taker to maker
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.taker.to_account_info(),
                to: ctx.accounts.maker.to_account_info(),
            },
        ),
        ctx.accounts.vault.price,
    )?;

    Ok(())
}
