use anchor_lang::prelude::*;

#[error_code]
pub enum AppError {
    #[msg("Missing collection metadata account")]
    MissingCollectionMetadataAccount,

    #[msg("Missing collection master edition account")]
    MissingCollectionMasterEditionAccount,
}
