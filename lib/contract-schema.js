import { Data, } from "@anastasia-labs/lucid-cardano-fork";
// data PSimpleSale (s :: S)
//   = PSimpleSale
//       ( Term
//           s
//           ( PDataRecord
//               '[ "sellerAddress" ':= PAddress
//                , "priceOfAsset" ':= PInteger
//                ]
//           )
//       )
// unknown -> schema -> true | false
export const CredentialSchema = Data.Enum([
    Data.Object({
        PublicKeyCredential: Data.Tuple([
            Data.Bytes({ minLength: 28, maxLength: 28 }),
        ]),
    }),
    Data.Object({
        ScriptCredential: Data.Tuple([
            Data.Bytes({ minLength: 28, maxLength: 28 }),
        ]),
    }),
]);
export const CredentialD = CredentialSchema;
export const AddressSchema = Data.Object({
    paymentCredential: CredentialSchema,
    stakeCredential: Data.Nullable(Data.Enum([
        Data.Object({ Inline: Data.Tuple([CredentialSchema]) }),
        Data.Object({
            Pointer: Data.Tuple([
                Data.Object({
                    slotNumber: Data.Integer(),
                    transactionIndex: Data.Integer(),
                    certificateIndex: Data.Integer(),
                }),
            ]),
        }),
    ])),
});
export const AddressD = AddressSchema;
const SimpleSaleSchema = Data.Object({
    sellerAddress: AddressSchema,
    priceOfAsset: Data.Integer(),
});
export const SimpleSale = SimpleSaleSchema;
// data PMarketRedeemer (s :: S)
//   = PBuy (Term s (PDataRecord '[...]))
//   | PWithdraw (Term s (PDataRecord '[...]))
// const MarketRedeemerSchema = Data.Enum([
//   Data.Object({
//     Buy: Data.Nullable(Data.Bytes())
//   }),
//   Data.Object({
//     Withdraw: Data.Nullable(Data.Bytes()),
//   }),
// ]);
// export type MarketRedeemerSchema = Data.Static<typeof MarketRedeemerSchema>
const MarketRedeemerSchema = Data.Enum([
    Data.Literal("PBuy"),
    Data.Literal("PWithdraw")
]);
export const MarketRedeemer = MarketRedeemerSchema;
