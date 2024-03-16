import { Data } from "@anastasia-labs/lucid-cardano-fork";
import { SimpleSale } from "../contract-schema.js";
import { toAddress } from "../utils.js";
//import script from "./marketplace.json";
//seller have to sign it (inside the datum sellerAddress)
//const bobaddress = "addr_test1qpucnhlcty7ak9lvhzkn6t9lj95cvwxz2kwsfanwvj9e2f0sq9wkgzt28u58u7xlnugeaa26vmq7vx0k888244yuc7zq2kpkt5"
export async function txWithdrawNft(marketplaceAddr, redeemer, script, lucid) {
    const addr = await lucid.wallet.address();
    // get all utxos locked at marketplace
    const utxos = await lucid.utxosAt(marketplaceAddr);
    //console.log("withdraw - marketplace utxos", utxos)
    //console.log ("before utxos length", utxos.length);
    // filtered utxos
    const f_utxos = utxos.filter((u) => findSellerAddress(u, addr, lucid));
    if (!f_utxos)
        throw new Error("Utxos not found");
    //console.log ("after utxos length", f_utxos.length);
    const tx = await lucid
        .newTx()
        .collectFrom(f_utxos, redeemer)
        .attachSpendingValidator(script)
        .addSigner(addr)
        .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
}
function findSellerAddress(u, addr, lucid) {
    const datumCbor = u.datum;
    //console.log("calling filter function");
    if (datumCbor != undefined) {
        const datum = Data.from(datumCbor, SimpleSale);
        const datumSellerAddress = toAddress(datum.sellerAddress, lucid);
        if (addr == datumSellerAddress) {
            //console.log("address equal - wallet", addr);
            //console.log("address equal - datum ", datumSellerAddress);
            return true;
        }
        else {
            //console.log("address does not match");
            //console.log("address not equal - wallet", addr);
            //console.log("address not equal - datum ", datumSellerAddress);
            return false;
        }
    }
    else {
        return false;
    }
}
