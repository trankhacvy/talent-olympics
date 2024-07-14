export type WhitelistGatedTokenSale = {
  version: "0.1.0";
  name: "whitelist_gated_token_sale";
  instructions: [
    {
      name: "initDistributor";
      accounts: [
        {
          name: "config";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: true;
        },
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "root";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "tokenPrice";
          type: "u64";
        },
        {
          name: "limitPerWallet";
          type: "u64";
        },
        {
          name: "tokenName";
          type: "string";
        },
        {
          name: "tokenSymbol";
          type: "string";
        },
        {
          name: "uri";
          type: "string";
        }
      ];
    },
    {
      name: "mintToken";
      accounts: [
        {
          name: "config";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "minterTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "minter";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "proof";
          type: {
            vec: {
              array: ["u8", 32];
            };
          };
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "config";
      type: {
        kind: "struct";
        fields: [
          {
            name: "root";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "tokenPrice";
            type: "u64";
          },
          {
            name: "limitPerWallet";
            type: "u64";
          },
          {
            name: "bump";
            type: {
              array: ["u8", 1];
            };
          }
        ];
      };
    },
    {
      name: "mintCounter";
      type: {
        kind: "struct";
        fields: [
          {
            name: "minted";
            type: "u64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidProof";
      msg: "Invalid Merkle Proof";
    },
    {
      code: 6001;
      name: "ExceededMaxMint";
      msg: "Exceeded maximum mint amount.";
    }
  ];
};

export const IDL: WhitelistGatedTokenSale = {
  version: "0.1.0",
  name: "whitelist_gated_token_sale",
  instructions: [
    {
      name: "initDistributor",
      accounts: [
        {
          name: "config",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: true,
        },
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "root",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "tokenPrice",
          type: "u64",
        },
        {
          name: "limitPerWallet",
          type: "u64",
        },
        {
          name: "tokenName",
          type: "string",
        },
        {
          name: "tokenSymbol",
          type: "string",
        },
        {
          name: "uri",
          type: "string",
        },
      ],
    },
    {
      name: "mintToken",
      accounts: [
        {
          name: "config",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "minterTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "minter",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "proof",
          type: {
            vec: {
              array: ["u8", 32],
            },
          },
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "config",
      type: {
        kind: "struct",
        fields: [
          {
            name: "root",
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "tokenPrice",
            type: "u64",
          },
          {
            name: "limitPerWallet",
            type: "u64",
          },
          {
            name: "bump",
            type: {
              array: ["u8", 1],
            },
          },
        ],
      },
    },
    {
      name: "mintCounter",
      type: {
        kind: "struct",
        fields: [
          {
            name: "minted",
            type: "u64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidProof",
      msg: "Invalid Merkle Proof",
    },
    {
      code: 6001,
      name: "ExceededMaxMint",
      msg: "Exceeded maximum mint amount.",
    },
  ],
};
