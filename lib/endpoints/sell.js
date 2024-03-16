//import script from "./marketplace.json";
export async function txSellNft(marketplaceAddr, datum, nft, lucid) {
    const tx = await lucid
        .newTx()
        .payToContract(marketplaceAddr, { inline: datum }, nft)
        .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
}
