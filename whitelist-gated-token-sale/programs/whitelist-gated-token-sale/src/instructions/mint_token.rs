use anchor_lang::{prelude::*, solana_program::keccak};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

use crate::{
    constants::{CONFIG_SEED, MINT_COUNTER_SEED},
    errors::AppError,
    state::{Config, MintCounter},
    utils::merkle_verify,
};

#[derive(Accounts)]
pub struct MintToken<'info> {
    #[account(
        seeds = [
            CONFIG_SEED.as_ref(),
        ],
        bump,
    )]
    pub config: Account<'info, Config>,

    #[account(
        init_if_needed,
        payer = minter,
        seeds = [
            MINT_COUNTER_SEED.as_ref(),
            minter.key().as_ref()
        ],
        bump,
        space = 8 + MintCounter::INIT_SPACE
    )]
    pub mint_counter: Account<'info, MintCounter>,

    #[account(
        mut,
        mint::decimals = 9,
        mint::authority = config,
        mint::freeze_authority = config,

    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = minter,
        associated_token::mint = mint,
        associated_token::authority = minter
    )]
    pub minter_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub minter: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn mint_token(ctx: Context<MintToken>, proof: Vec<[u8; 32]>, amount: u64) -> Result<()> {
    let minter = &ctx.accounts.minter;
    let config = &ctx.accounts.config;

    let leaf = keccak::hashv(&[minter.key().to_string().as_bytes()]);

    require!(
        merkle_verify(proof, config.root, leaf.0),
        AppError::InvalidProof,
    );

    let mint_counter = &ctx.accounts.mint_counter;

    require!(
        mint_counter.minted + amount <= config.limit_per_wallet,
        AppError::ExceededMaxMint,
    );

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.minter_token_account.to_account_info(),
                authority: ctx.accounts.config.to_account_info(),
            },
            &[&config.seeds()],
        ),
        10u64.pow(ctx.accounts.mint.decimals as u32) * amount,
    )?;

    ctx.accounts.mint_counter.minted += amount;

    Ok(())
}
