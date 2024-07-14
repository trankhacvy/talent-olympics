export type AnchorMarketplace = {
  version: "0.1.0"
  name: "anchor_marketplace"
  instructions: [
    {
      name: "initialize"
      accounts: [
        {
          name: "admin"
          isMut: true
          isSigner: true
        },
        {
          name: "marketplace"
          isMut: true
          isSigner: false
        },
        {
          name: "rewardsMint"
          isMut: true
          isSigner: false
        },
        {
          name: "treasury"
          isMut: false
          isSigner: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "tokenProgram"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "name"
          type: "string"
        },
        {
          name: "fee"
          type: "u16"
        }
      ]
    },
    {
      name: "list"
      accounts: [
        {
          name: "maker"
          isMut: true
          isSigner: true
        },
        {
          name: "marketplace"
          isMut: false
          isSigner: false
        },
        {
          name: "makerMint"
          isMut: false
          isSigner: false
        },
        {
          name: "collectionMint"
          isMut: false
          isSigner: false
        },
        {
          name: "makerAta"
          isMut: true
          isSigner: false
        },
        {
          name: "vault"
          isMut: true
          isSigner: false
        },
        {
          name: "listing"
          isMut: true
          isSigner: false
        },
        {
          name: "metadata"
          isMut: false
          isSigner: false
        },
        {
          name: "masterEdition"
          isMut: false
          isSigner: false
        },
        {
          name: "metadataProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "associatedTokenProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "tokenProgram"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "price"
          type: "u64"
        }
      ]
    },
    {
      name: "delist"
      accounts: [
        {
          name: "maker"
          isMut: true
          isSigner: true
        },
        {
          name: "marketplace"
          isMut: false
          isSigner: false
        },
        {
          name: "makerMint"
          isMut: false
          isSigner: false
        },
        {
          name: "makerAta"
          isMut: true
          isSigner: false
        },
        {
          name: "listing"
          isMut: true
          isSigner: false
        },
        {
          name: "vault"
          isMut: true
          isSigner: false
        },
        {
          name: "tokenProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: "purchase"
      accounts: [
        {
          name: "taker"
          isMut: true
          isSigner: true
        },
        {
          name: "maker"
          isMut: true
          isSigner: false
        },
        {
          name: "makerMint"
          isMut: false
          isSigner: false
        },
        {
          name: "marketplace"
          isMut: false
          isSigner: false
        },
        {
          name: "takerAta"
          isMut: true
          isSigner: false
        },
        {
          name: "vault"
          isMut: true
          isSigner: false
        },
        {
          name: "rewards"
          isMut: true
          isSigner: false
        },
        {
          name: "listing"
          isMut: true
          isSigner: false
        },
        {
          name: "treasury"
          isMut: true
          isSigner: false
        },
        {
          name: "associatedTokenProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "tokenProgram"
          isMut: false
          isSigner: false
        }
      ]
      args: []
    }
  ]
  accounts: [
    {
      name: "listing"
      type: {
        kind: "struct"
        fields: [
          {
            name: "maker"
            type: "publicKey"
          },
          {
            name: "mint"
            type: "publicKey"
          },
          {
            name: "price"
            type: "u64"
          },
          {
            name: "bump"
            type: "u8"
          }
        ]
      }
    },
    {
      name: "marketplace"
      type: {
        kind: "struct"
        fields: [
          {
            name: "admin"
            type: "publicKey"
          },
          {
            name: "fee"
            type: "u16"
          },
          {
            name: "bump"
            type: "u8"
          },
          {
            name: "treasuryBump"
            type: "u8"
          },
          {
            name: "rewardsBump"
            type: "u8"
          },
          {
            name: "name"
            type: "string"
          }
        ]
      }
    }
  ]
  errors: [
    {
      code: 6000
      name: "NameTooLong"
      msg: "Name must be between 1 and 32 characters"
    }
  ]
}

export const IDL: AnchorMarketplace = {
  version: "0.1.0",
  name: "anchor_marketplace",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "marketplace",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardsMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasury",
          isMut: false,
          isSigner: false,
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
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "fee",
          type: "u16",
        },
      ],
    },
    {
      name: "list",
      accounts: [
        {
          name: "maker",
          isMut: true,
          isSigner: true,
        },
        {
          name: "marketplace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "makerMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "makerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "listing",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "masterEdition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
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
      ],
      args: [
        {
          name: "price",
          type: "u64",
        },
      ],
    },
    {
      name: "delist",
      accounts: [
        {
          name: "maker",
          isMut: true,
          isSigner: true,
        },
        {
          name: "marketplace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "makerMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "makerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "listing",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "purchase",
      accounts: [
        {
          name: "taker",
          isMut: true,
          isSigner: true,
        },
        {
          name: "maker",
          isMut: true,
          isSigner: false,
        },
        {
          name: "makerMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "marketplace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "takerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewards",
          isMut: true,
          isSigner: false,
        },
        {
          name: "listing",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
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
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "listing",
      type: {
        kind: "struct",
        fields: [
          {
            name: "maker",
            type: "publicKey",
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "marketplace",
      type: {
        kind: "struct",
        fields: [
          {
            name: "admin",
            type: "publicKey",
          },
          {
            name: "fee",
            type: "u16",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "treasuryBump",
            type: "u8",
          },
          {
            name: "rewardsBump",
            type: "u8",
          },
          {
            name: "name",
            type: "string",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "NameTooLong",
      msg: "Name must be between 1 and 32 characters",
    },
  ],
}
