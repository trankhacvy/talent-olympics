use anchor_lang::prelude::*;

#[error_code]
pub enum AppError {
    #[msg("Invalid Merkle Proof")]
    InvalidProof,
    
    #[msg("Exceeded maximum mint amount.")]
    ExceededMaxMint,
}
