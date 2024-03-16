// sum.test.js
import { describe, it, expect, test } from "vitest";
import fc from "fast-check";
import { sum } from "../src/sum.js";
import {
  Assets,
  Data,
  Emulator,
  Lucid,
  Script,
  TxHash,
  fromText,
  generateSeedPhrase,
} from "@anastasia-labs/lucid-cardano-fork";
import { MarketRedeemer, SimpleSale } from "../src/contract-schema.js";
import { fromAddress, toAddress } from "../src/utils.js";
import script from "./marketplace.json";
import { Constr } from "@anastasia-labs/lucid-cardano-fork";

import { txSellNft } from "../lib/endpoints/sell.js";
import { txWithdrawNft } from "../lib/endpoints/withdraw.js";
import { txBuyNft } from "../lib/endpoints/buy.js";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

console.log("testing");

export const generateAccountSeedPhrase = async (assets: Assets) => {
  const seedPhrase = generateSeedPhrase();
  return {
    seedPhrase,
    address: await (await Lucid.new(undefined, "Custom"))
      .selectWalletFromSeed(seedPhrase)
      .wallet.address(),
    assets,
  };
};

console.log(await generateAccountSeedPhrase({ lovelace: 10_000_000n }));

test("Alice sells NFT, Bob buys NFT", async () => {
  const policyid = "88dc7cd1c28d3a0c7ef4df99036c7c9688d309d91a1bb6fe4b08fee9";
  const myToken = fromText("myToken");
  const unit = policyid + myToken;
  const user1 = await generateAccountSeedPhrase({
    lovelace: 10_000_000n,
  });
  const user2 = await generateAccountSeedPhrase({
    lovelace: 30_000_000n,
    [unit]: 70n,
  });



  const emulator = new Emulator([user1, user2]);
  const lucid = await Lucid.new(emulator);

  lucid.selectWalletFromSeed(user1.seedPhrase);
  console.log(await lucid.wallet.getUtxos());

  lucid.selectWalletFromSeed(user2.seedPhrase);
  console.log(await lucid.wallet.getUtxos());

  const tx = await lucid
    .newTx()
    .payToAddress(user1.address, { lovelace: 5_000_000n, [unit]: 5n })
    .complete();
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
 
  // this seems to work
  //const txHash = await testTx(user1.address, 4000000, lucid);
  console.log(txHash);


  emulator.awaitBlock(10);

  lucid.selectWalletFromSeed(user1.seedPhrase);
  console.log("user1 utxos : ", await lucid.wallet.getUtxos());

  const datum = Data.to(
    { sellerAddress: fromAddress(user2.address), priceOfAsset: 5_000_000n },
    SimpleSale
  );
  console.log("SimpleSale datum as cbor", datum);
  // const mydatum = new Constr (0, [
  //   Constr 0 [ "pukhash"],
  //   Constr 0 [
  //     Constro 0 [
  //       "stakehash"
  //     ]
  //   ]
  // ]
  //   121_0([_
  //     121_0([_ -> address
  //         121_0([_
  //             h'ad2eac5b83ee132d92f33fefc9cfc265430db6fc4a001110c7407995', -> pubkeyhash
  //         ]),
  //         121_0([_
  //             121_0([_
  //                 121_0([_
  //                     h'09a3a2c68cc405fc5656a77eb89460a91f24a775c86ba8039ea70b75', -> stakehash
  //                 ]),
  //             ]),
  //         ]),
  //     ]),
  //     5000000_2, -> _2 _3
  // ])
  console.log(
    "user address as schema",
    JSON.stringify(fromAddress(user2.address))
  );

  const buy = Data.to("PBuy", MarketRedeemer);
  console.log("buy", buy);
  // d87980 == 121_0([]) == Constr 0 [] == PBuy
  const withdraw = Data.to("PWithdraw", MarketRedeemer);
  console.log("withdraw", withdraw);
  // d87a80 == 122_0([]) == Constr 1 [] == PWithdraw

  // CDDL
  // plutus_data =
  //   constr<plutus_data>
  // / { * plutus_data => plutus_data }
  // / [ * plutus_data ]
  // / big_int
  // / bounded_bytes

  // constr<a> =
  //   #6.121([* a]) -> Constr 0 [...]
  // / #6.122([* a]) -> Constr 1 [...]
  // / #6.123([* a]) ...
  // / #6.124([* a]) ...
  // / #6.125([* a])
  // / #6.126([* a])
  // / #6.127([* a])
  // ; similarly for tag range: 6.1280 .. 6.1400 inclusive
  // / #6.102([uint, [* a]])

  // Plutus
  // Constr Integer [Data]
  // Map [(Data, Data)]
  // List [Data]
  // I Integer
  // B ByteString
  const rawdatumCBOR =
    "d8799fd8799fd8799f581cad2eac5b83ee132d92f33fefc9cfc265430db6fc4a001110c7407995ffd8799fd8799fd8799f581c09a3a2c68cc405fc5656a77eb89460a91f24a775c86ba8039ea70b75ffffffff1a004c4b40ff";
  const datumSample = Data.from(rawdatumCBOR, SimpleSale);
  console.log("priceOfAsset ", datumSample.priceOfAsset);
  console.log("sellerAddress ", datumSample.sellerAddress);
  console.log(
    "sellerAddress as bech32 :",
    toAddress(datumSample.sellerAddress, lucid)
  );

  const marketplace: Script = {
    type: "PlutusV2",
    script: script.cborHex, //script = marketplace.json
  };
  const marketplaceAddr = lucid.utils.validatorToAddress(marketplace);
  
  
  console.log("marketplaceAddr :", marketplaceAddr);
});

// Homework
  //1. Alice locks 1 NFT -> MarketPlace Contract
  //const txLockNFT = await 
  //2. Bob fetch all utxos from MarketPlace contract
  //3. Bob picks 1 utxo
  //4. Build tx with
  //   - Collect the utxo
  //   - convert the raw datum to simpleSale schema
  //   - we get the price of the asset and the address "sellerAddress"
  //   - convert "sellerAddress" to sellerAddress as bech32
  //   - pay to Alice
  //   - attach market contract, attach the redeemer "PBuy"

  // const txSell = await lucid.newTx().payToContract().complete();

  // sign .. submit .. awaitblock

  //BOB fetching the contract address
  // pick one element
  // lucid.utxosAt()

  // const txBuy = await lucid.newTx().collectFrom().payToAddress().complete();
function makeAsset (name : string) {

  const testpolicyid = "88dc7cd1c28d3a0c7ef4df99036c7c9688d309d91a1bb6fe4b08fee9";
  const testmyToken = fromText(name)
  return (testpolicyid + testmyToken);

}

test("Alice sells, Bob sells, Alice withdraws, Alice buys", async () => {
  // emulator
  // users with assets
  // tx to sell
  // tx to withdraw

  // generate test NFT
  const testpolicyid = "11dc7cd1c28d3a0c7ef4df99036c7c9688d309d91a1bb6fe4b08fee9";
  const testmyToken = fromText("testToken");
  const testunit = testpolicyid + testmyToken;

  const alice = await generateAccountSeedPhrase({
    lovelace: 10_000_000n,
    [testunit]: 1n,
  });
  const bob = await generateAccountSeedPhrase({
    lovelace: 5_000_000n,
    [makeAsset("hahaha")] : 2n,
    
  });

  console.log("alice's starting wallet", alice);
  console.log("bob's starting wallet", bob);

  // init emulator and lucid instance?
  const emulator = new Emulator([alice, bob]);
  const lucid = await Lucid.new(emulator);

  // marketplace valiator as address
  const marketplace: Script = {
    type: "PlutusV2",
    script: script.cborHex, //script = marketplace.json
  };
  const marketplaceAddr = lucid.utils.validatorToAddress(marketplace);

  const testDatum1 = Data.to(
    { sellerAddress: fromAddress(alice.address), priceOfAsset: 1_000_000n },
    SimpleSale
  );
  //console.log("testDatum sellerAddress", tAddress ,lucid));
  /*
  const reverseTestDatum = Data.from(testDatum, SimpleSale);
  console.log("reverseTestDatum", reverseTestDatum);
  console.log(
    "reverseTestDatum sellerAddress as bech32 :",
    toAddress(reverseTestDatum.sellerAddress, lucid)
  );
  */

  lucid.selectWalletFromSeed(alice.seedPhrase);
  //console.log("alice's starting utxos", await lucid.wallet.getUtxos());

  //console.log("alice's address as bech32 (3)", alice.address);

  //pay to marketplace script inline datum/ test nft
  
  /*
  //{inline: testDatum}
  const txSell = await lucid
  .newTx()
  .payToContract(marketplaceAddr, testDatum,
    { [testunit]: 1n } )
  .complete();
  const signedTxSell = await txSell.sign().complete();
  const txHashSell = await signedTxSell.submit()
  */

  const txHashSell1 = await txSellNft(marketplaceAddr, testDatum1, {[testunit] : 1n },lucid);
 
  console.log("alice locks NFT to marketplace - ", txHashSell1);
  
  emulator.awaitBlock(10);

  //lucid.selectWalletFromSeed(alice.seedPhrase);
  console.log("alice's UTXOs (after sell)", await lucid.wallet.getUtxos() );
  console.log("marketplace's UTXOs (after sell)", await lucid.utxosAt(marketplaceAddr) );

  // withdraw that NFT from marketplace
  //console.log("alice's address - after tx", alice.address);
  //const laaddress = await lucid.wallet.;
  //emulator.awaitBlock(10)
  //console.log("alice's lucid address - after tx", await lucid.wallet.address());
  
  const testDatum2 = Data.to(
    { sellerAddress: fromAddress(bob.address), priceOfAsset: 2_000_000n },
    SimpleSale
  );

  lucid.selectWalletFromSeed(bob.seedPhrase);
  //console.log("bob's utxos" ,await lucid.wallet.getUtxos());
  
  const txHashSell2 = await txSellNft(marketplaceAddr, testDatum2, {[makeAsset("hahaha")] : 2n },lucid);
 
  console.log("bob locks NFT to marketplace - ", txHashSell2);
  
  emulator.awaitBlock(10);

  //lucid.selectWalletFromSeed(alice.seedPhrase);
 
  console.log("bob's UTXOs (after sell)", await lucid.wallet.getUtxos() );
  console.log("marketplace's UTXOs (after sell)", await lucid.utxosAt(marketplaceAddr) );

  //console.log("bob's address as bech32 (3)", bob.address);
  
  lucid.selectWalletFromSeed(alice.seedPhrase);
  const testRedeemer1 = Data.to("PWithdraw", MarketRedeemer);

  //const utxos = await lucid.utxosAt(marketplaceAddr);
  
  /*
  console.log("utxos at marketplace", utxos);
  const cbor = "d8799fd8799fd8799f581cdb4c4457afc531a5b2f886c999c7868470848da6d4581fd44e8093aaffd8799fd8799fd8799f581c9657c510fe56b1fc28dcc2ae54bf2126a5d69a65e49673aed5500fdcffffffff1a05f5e100ff";
  const cbor = "d8799fd8799fd8799f581c74e909d2e4161a26d75216e57be6bd79d86bdc45c9179fb115dfb85bffd8799fd8799fd8799f581cdcf7449129d55b675e3ef421f99143033c612c154c73ee6199aa4545ffffffff1a05f5e100ff";
  const datumCbor  = utxos.at(0)?.datum;
  if (datumCbor != undefined) {
  const datumSample = Data.from(datumCbor , SimpleSale);
  console.log("marketplace priceOfAsset ", datumSample.priceOfAsset);
  console.log("marketplace sellerAddress ", datumSample.sellerAddress);
  console.log(
    "marketplace sellerAddress as bech32 :",
    toAddress(datumSample.sellerAddress, lucid)); }
  */


  const txHashWithdraw = await txWithdrawNft(marketplaceAddr, testRedeemer1, marketplace, lucid);
  console.log("alice withdraws her NFT - ", txHashWithdraw);

  emulator.awaitBlock(10);

  //lucid.selectWalletFromSeed(alice.seedPhrase);
  console.log("alice's UTXOs (after withdraw)", await lucid.wallet.getUtxos() );
  console.log("marketplace's UTXOs (after withdraw)", await lucid.utxosAt(marketplaceAddr) );

  //alice chooses a NFT for marketplace utxos
  const choice = await lucid.utxosAt(marketplaceAddr);

  const firstchoice = choice.at(0) // chooses the first utxos available.

  const testRedeemer2 = Data.to("PBuy", MarketRedeemer);

  const txHashBuy = await txBuyNft (firstchoice, testRedeemer2, marketplace, lucid);
  console.log("alice buys the first available utxo NFT - ", txHashBuy);

  emulator.awaitBlock(10);

  console.log("alice's UTXOs (after buy)", await lucid.wallet.getUtxos() );
  lucid.selectWalletFromSeed(bob.seedPhrase);
  console.log("bob's UTXOs (after buy)", await lucid.wallet.getUtxos() );
  console.log("marketplace's UTXOs (after buy)", await lucid.utxosAt(marketplaceAddr) );




});

/*
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

export async function testTx(a: string, amount : number, lucid : Lucid): Promise<TxHash> {
const tx = await lucid
    .newTx()
    .payToAddress(a, { lovelace: BigInt(amount) })
    .complete();
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;
}
*/


/*

test("property test", () => {
  // console.log(fc.bigIntN(2));
  console.log(fc.bigInt())
});

// Code under test
const contains = (text, pattern) => text.indexOf(pattern) >= 0;

// Properties
describe('properties', () => {
  // string text always contains itself
  it('should always contain itself', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        return contains(text, text);
      }),
    );
  });

  // string a + b + c always contains b, whatever the values of a, b and c
  it('should always contain its substrings', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        console.log(a, " - ",b," - ",c)
        // Alternatively: no return statement and direct usage of expect or assert
        return contains(a + b + c, b);
      }),
    );
  });
});

*/