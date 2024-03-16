import { Data } from "@anastasia-labs/lucid-cardano-fork";
import { SimpleSale } from "../contract-schema.js";
import { toAddress } from "../utils.js";
export async function txBuyNft(utxo, redeemer, script, lucid) {
    const datumCbor = utxo.datum;
    //const buyerAddress = await lucid.wallet.address();
    //console.log("inside buy - datum cbor", datumCbor);
    //console.log("inside buy - chosen utxo", utxo);
    if (datumCbor != undefined) {
        const datum = Data.from(datumCbor, SimpleSale);
        const datumSellerAddress = toAddress(datum.sellerAddress, lucid);
        const price = datum.priceOfAsset;
        const tx = await lucid
            .newTx()
            .collectFrom([utxo], redeemer)
            .attachSpendingValidator(script)
            .payToAddress(datumSellerAddress, { lovelace: price })
            //.payToAddress(buyerAddress, utxo.assets)
            .complete();
        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        return txHash;
    }
    else
        throw new Error("Invalid UTXOs / no datum information");
}
