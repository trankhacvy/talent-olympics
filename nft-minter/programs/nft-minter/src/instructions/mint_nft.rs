use anchor_lang::{prelude::*, solana_program::sysvar};
use anchor_spl::{associated_token::AssociatedToken, token::Token};
use mpl_token_metadata::{
    instructions::{CreateV1CpiBuilder, MintV1CpiBuilder},
    types::{PrintSupply, TokenStandard},
};

#[derive(Accounts)]
pub struct MintNFT<'info> {
    /// NFT mint
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    pub nft_mint: Signer<'info>,

    /// Metadata account of the NFT.
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    nft_metadata: UncheckedAccount<'info>,

    /// Master edition account of the NFT.
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    nft_master_edition: UncheckedAccount<'info>,

    /// Destination token account
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    token: UncheckedAccount<'info>,

    /// Payer for transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Token metadata program
    ///
    /// CHECK: account checked in CPI
    #[account( address = mpl_token_metadata::ID )]
    pub token_metadata_program: UncheckedAccount<'info>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Token program
    pub token_program: Program<'info, Token>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// Instructions sysvar account.
    ///
    /// CHECK: account constraints checked in account trait
    #[account(address = sysvar::instructions::id())]
    pub sysvar_instructions: UncheckedAccount<'info>,
}

pub fn mint_nft(
    ctx: Context<MintNFT>,
    name: String,
    symbol: String,
    uri: String,
    seller_fee_basis_points: u16,
) -> Result<()> {
    // create metadata account
    CreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program)
        .metadata(&ctx.accounts.nft_metadata)
        .mint(&ctx.accounts.nft_mint, true)
        .authority(&ctx.accounts.payer)
        .payer(&ctx.accounts.payer)
        .master_edition(Some(&ctx.accounts.nft_master_edition))
        .update_authority(&ctx.accounts.payer, true)
        .token_standard(TokenStandard::NonFungible)
        .print_supply(PrintSupply::Zero)
        .name(name)
        .symbol(symbol)
        .uri(uri)
        .seller_fee_basis_points(seller_fee_basis_points)
        .decimals(0)
        .system_program(&ctx.accounts.system_program)
        .sysvar_instructions(&ctx.accounts.sysvar_instructions)
        .spl_token_program(Some(&ctx.accounts.token_program))
        .invoke()?;

    // mint nft
    MintV1CpiBuilder::new(&ctx.accounts.token_metadata_program)
        .token(&ctx.accounts.token)
        .token_owner(Some(&ctx.accounts.payer))
        .metadata(&ctx.accounts.nft_metadata)
        .master_edition(Some(&ctx.accounts.nft_master_edition))
        .mint(&ctx.accounts.nft_mint)
        .authority(&ctx.accounts.payer)
        .payer(&ctx.accounts.payer)
        .system_program(&ctx.accounts.system_program)
        .sysvar_instructions(&ctx.accounts.sysvar_instructions)
        .spl_token_program(&ctx.accounts.token_program)
        .spl_ata_program(&ctx.accounts.associated_token_program)
        .amount(1)
        .invoke()?;

    Ok(())
}
