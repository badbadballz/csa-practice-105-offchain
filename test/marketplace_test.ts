import { describe, it, expect, test } from "vitest";
import fc from "fast-check";
//import { sum } from "../src/sum.js";
import { generateAccountSeedPhrase } from "./lucid-emulator.test.js";
import {
  Assets,
  Data,
  Emulator,
  Lucid,
  Script,
  fromText,
  generateSeedPhrase,
} from "@anastasia-labs/lucid-cardano-fork";
import { MarketRedeemer, SimpleSale } from "../src/contract-schema.js";
import { fromAddress, toAddress } from "../src/utils.js";
import script from "./marketplace.json";
import { Constr } from "@anastasia-labs/lucid-cardano-fork";


// Homework

  const alice = await generateAccountSeedPhrase({
    lovelace: 99_999n,
  });
  const bob = await generateAccountSeedPhrase({
    lovelace: 88_888n,
    //[unit]: 70n,
  });

  console.log(alice);
  console.log(bob);
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
