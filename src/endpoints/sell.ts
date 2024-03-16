//import { Script } from "@anastasia-labs/lucid-cardano-fork";
import { Assets, Data, Lucid, TxHash } from "@anastasia-labs/lucid-cardano-fork";
import { SimpleSale } from "../contract-schema.js";
//import script from "./marketplace.json";


export async function txSellNft(marketplaceAddr: string, datum: string, nft : Assets, 
                    lucid : Lucid): Promise<TxHash> {
const tx = await lucid
            .newTx()
            .payToContract(marketplaceAddr, {inline: datum}, nft )
            .complete();
    
const signedTx = await tx.sign().complete();
const txHash = await signedTx.submit();

    return txHash;
  }