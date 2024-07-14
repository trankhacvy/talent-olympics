use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata,
    },
    token::{Mint, Token},
};

use crate::{constants::CONFIG_SEED, state::Config};

#[derive(Accounts)]
pub struct InitDistributor<'info> {
    #[account(
        init,
        payer = payer,
        seeds = [
            CONFIG_SEED.as_ref(),
        ],
        bump,
        space = 8 + Config::INIT_SPACE
    )]
    pub config: Account<'info, Config>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = config,
        mint::freeze_authority = config,

    )]
    pub mint: Account<'info, Mint>,

    /// CHECK: Validate address by deriving pda
    #[account(
        mut,
        seeds = [b"metadata", token_metadata_program.key().as_ref(), mint.key().as_ref()],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn init_distributor(
    ctx: Context<InitDistributor>,
    root: [u8; 32],
    token_price: u64,
    limit_per_wallet: u64,
    token_name: String,
    token_symbol: String,
    uri: String,
) -> Result<()> {
    ctx.accounts.config.token_price = token_price;

    ctx.accounts.config.limit_per_wallet = limit_per_wallet;

    ctx.accounts.config.root = root;

    ctx.accounts.config.bump = [ctx.bumps.config];

    // create token

    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.config.to_account_info(),
                update_authority: ctx.accounts.config.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            &[&ctx.accounts.config.seeds()],
        ),
        DataV2 {
            name: token_name,
            symbol: token_symbol,
            uri: uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        },
        false,
        true,
        None,
    )?;

    msg!("Token created successfully.");

    Ok(())
}
