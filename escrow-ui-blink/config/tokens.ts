import { Token } from "@/types"
// import { NATIVE_MINT } from "@solana/spl-token"

export const tokenList: Token[] = [
  //   {
  //     name: "Solana",
  //     symbol: "SOL",
  //     isNative: true,
  //     address: NATIVE_MINT.toBase58(),
  //     decimals: 9,
  //     icon: "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756",
  //   },
  {
    name: "USDC",
    symbol: "USDC",
    isNative: false,
    address: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    decimals: 6,
    icon: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
  },
  {
    name: "Raydium",
    symbol: "RAY",
    isNative: false,
    address: "5VWKWcgPNDiK2khhSUoX8UGXGJZ2WUtvrBYZBCNAXMww",
    decimals: 6,
    icon: "https://assets.coingecko.com/coins/images/13928/standard/PSigc4ie_400x400.jpg?1696513668",
  },
]
