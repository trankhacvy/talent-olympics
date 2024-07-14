export type AnchorEscrow = {
  version: "0.1.0"
  name: "anchor_escrow"
  instructions: [
    {
      name: "make"
      accounts: [
        {
          name: "maker"
          isMut: true
          isSigner: true
        },
        {
          name: "mintA"
          isMut: false
          isSigner: false
        },
        {
          name: "mintB"
          isMut: false
          isSigner: false
        },
        {
          name: "makerAtaA"
          isMut: true
          isSigner: false
        },
        {
          name: "escrow"
          isMut: true
          isSigner: false
        },
        {
          name: "vault"
          isMut: true
          isSigner: false
        },
        {
          name: "associatedTokenProgram"
          isMut: false
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
        },
      ]
      args: [
        {
          name: "seed"
          type: "u64"
        },
        {
          name: "deposit"
          type: "u64"
        },
        {
          name: "receive"
          type: "u64"
        },
      ]
    },
    {
      name: "refund"
      accounts: [
        {
          name: "maker"
          isMut: true
          isSigner: true
        },
        {
          name: "mintA"
          isMut: false
          isSigner: false
        },
        {
          name: "makerAtaA"
          isMut: true
          isSigner: false
        },
        {
          name: "escrow"
          isMut: true
          isSigner: false
        },
        {
          name: "vault"
          isMut: true
          isSigner: false
        },
        {
          name: "associatedTokenProgram"
          isMut: false
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
        },
      ]
      args: []
    },
    {
      name: "take"
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
          name: "mintA"
          isMut: false
          isSigner: false
        },
        {
          name: "mintB"
          isMut: false
          isSigner: false
        },
        {
          name: "takerAtaA"
          isMut: true
          isSigner: false
        },
        {
          name: "takerAtaB"
          isMut: true
          isSigner: false
        },
        {
          name: "makerAtaB"
          isMut: true
          isSigner: false
        },
        {
          name: "escrow"
          isMut: true
          isSigner: false
        },
        {
          name: "vault"
          isMut: true
          isSigner: false
        },
        {
          name: "associatedTokenProgram"
          isMut: false
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
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: "escrow"
      type: {
        kind: "struct"
        fields: [
          {
            name: "seed"
            type: "u64"
          },
          {
            name: "maker"
            type: "publicKey"
          },
          {
            name: "mintA"
            type: "publicKey"
          },
          {
            name: "mintB"
            type: "publicKey"
          },
          {
            name: "receive"
            type: "u64"
          },
          {
            name: "bump"
            type: "u8"
          },
        ]
      }
    },
  ]
}

export const IDL: AnchorEscrow = {
  version: "0.1.0",
  name: "anchor_escrow",
  instructions: [
    {
      name: "make",
      accounts: [
        {
          name: "maker",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mintA",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintB",
          isMut: false,
          isSigner: false,
        },
        {
          name: "makerAtaA",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
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
      args: [
        {
          name: "seed",
          type: "u64",
        },
        {
          name: "deposit",
          type: "u64",
        },
        {
          name: "receive",
          type: "u64",
        },
      ],
    },
    {
      name: "refund",
      accounts: [
        {
          name: "maker",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mintA",
          isMut: false,
          isSigner: false,
        },
        {
          name: "makerAtaA",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
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
      name: "take",
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
          name: "mintA",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintB",
          isMut: false,
          isSigner: false,
        },
        {
          name: "takerAtaA",
          isMut: true,
          isSigner: false,
        },
        {
          name: "takerAtaB",
          isMut: true,
          isSigner: false,
        },
        {
          name: "makerAtaB",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
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
  ],
  accounts: [
    {
      name: "escrow",
      type: {
        kind: "struct",
        fields: [
          {
            name: "seed",
            type: "u64",
          },
          {
            name: "maker",
            type: "publicKey",
          },
          {
            name: "mintA",
            type: "publicKey",
          },
          {
            name: "mintB",
            type: "publicKey",
          },
          {
            name: "receive",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
}
