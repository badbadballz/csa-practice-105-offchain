import { Blockfrost, Lucid } from "@anastasia-labs/lucid-cardano-fork";
// const lucid = await Lucid.new();
// async function -> api, server, external service
// sync function
// continue
// ....
const lucid = await Lucid.new(new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "preprodOr3zZOkFc8Sqa5sp3aa9oGTb1wxulzhy"), "Preprod");
const seed = lucid.utils.generateSeedPhrase();
lucid.selectWalletFromSeed("jewel solid busy tomorrow woman magnet diagram husband shaft kingdom ritual humble mouse level equip seven swim web bid street inflict please exact desk");
const addr = await lucid.wallet.address();
console.log(addr);
const utxo = await lucid.utxosAt(addr);
console.log(utxo);
// Record type
// (alias) type Assets = {
//   [x: string]: bigint;
// }
// Unit = policyid+tokenname (hex)
const asset = {
    lovelace: 5000000n,
};
const userAddr = "addr_test1qp4cgm42esrud5njskhsr6uc28s6ljah0phsdqe7qmh3rfuyjgq5wwsca5camufxavmtnm8f6ywga3de3jkgmkwzma4sqv284l";
const tx = await lucid.newTx().payToAddress(userAddr, asset).complete();
// console.log(tx.txComplete.to_json())
const signedTx = await tx.sign().complete();
// console.log(signedTx.txSigned.to_json())
// console.log(signedTx.toString())
const txHash = await signedTx.submit();
console.log(txHash);
// {
//   "body": {
//     "original_bytes": null,
//     "inputs": [
//       {
//         "transaction_id": "4f78f9e4afdbb6967f542d97789890405ee343c1c31aad5f0f577c2d8aea3705",
//         "index": "0"
//       }
//     ],
//     "outputs": [
//       {
//         "format": 0,
//         "address": "addr_test1qp4cgm42esrud5njskhsr6uc28s6ljah0phsdqe7qmh3rfuyjgq5wwsca5camufxavmtnm8f6ywga3de3jkgmkwzma4sqv284l",
//         "amount": {
//           "coin": "5000000",
//           "multiasset": null
//         },
//         "datum": null,
//         "script_ref": null
//       },
//       {
//         "format": 0,
//         "address": "addr_test1qpx86xq9sly9nn88x7fvfa24tzg0xr76xd8t9f9tgv0s0ea6agenjzskzzvj6gwxdx7n3easanrsstnvtgn5tyz0hmuqcpd7sv",
//         "amount": {
//           "coin": "4831947",
//           "multiasset": null
//         },
//         "datum": null,
//         "script_ref": null
//       }
//     ],
//     "fee": "168053",
//     "ttl": null,
//     "certs": null,
//     "withdrawals": null,
//     "update": null,
//     "auxiliary_data_hash": null,
//     "validity_start_interval": null,
//     "mint": null,
//     "script_data_hash": null,
//     "collateral": null,
//     "required_signers": null,
//     "network_id": null,
//     "collateral_return": null,
//     "total_collateral": null,
//     "reference_inputs": null,
//     "voting_procedures": null,
//     "proposal_procedures": null
//   },
//   "witness_set": {
//     "vkeys": null,
//     "native_scripts": null,
//     "bootstraps": null,
//     "plutus_scripts": null,
//     "plutus_data": null,
//     "redeemers": null,
//     "plutus_v2_scripts": null,
//     "plutus_v3_scripts": null
//   },
//   "is_valid": true,
//   "auxiliary_data": null
// }
// {
//   "body": {
//     "original_bytes": null,
//     "inputs": [
//       {
//         "transaction_id": "4f78f9e4afdbb6967f542d97789890405ee343c1c31aad5f0f577c2d8aea3705",
//         "index": "0"
//       }
//     ],
//     "outputs": [
//       {
//         "format": 0,
//         "address": "addr_test1qp4cgm42esrud5njskhsr6uc28s6ljah0phsdqe7qmh3rfuyjgq5wwsca5camufxavmtnm8f6ywga3de3jkgmkwzma4sqv284l",
//         "amount": {
//           "coin": "5000000",
//           "multiasset": null
//         },
//         "datum": null,
//         "script_ref": null
//       },
//       {
//         "format": 0,
//         "address": "addr_test1qpx86xq9sly9nn88x7fvfa24tzg0xr76xd8t9f9tgv0s0ea6agenjzskzzvj6gwxdx7n3easanrsstnvtgn5tyz0hmuqcpd7sv",
//         "amount": {
//           "coin": "4831947",
//           "multiasset": null
//         },
//         "datum": null,
//         "script_ref": null
//       }
//     ],
//     "fee": "168053",
//     "ttl": null,
//     "certs": null,
//     "withdrawals": null,
//     "update": null,
//     "auxiliary_data_hash": null,
//     "validity_start_interval": null,
//     "mint": null,
//     "script_data_hash": null,
//     "collateral": null,
//     "required_signers": null,
//     "network_id": null,
//     "collateral_return": null,
//     "total_collateral": null,
//     "reference_inputs": null,
//     "voting_procedures": null,
//     "proposal_procedures": null
//   },
//   "witness_set": {
//     "vkeys": [
//       {
//         "vkey": "ed25519_pk1497s6phyqdntf64guu0hzvmz3f2q2qqz6qf0jca03ydafu0cjncspep5e3",
//         "signature": "f5ea59b37a75bf5f74ef55a8dff68aa1722b12ce1ae10f75e08e7091bf0539b0ed2ed7da06dd7fc2117bd69ddf04b146bbc43b566bc546599a0dbf7210f21603"
//       }
//     ],
//     "native_scripts": null,
//     "bootstraps": null,
//     "plutus_scripts": null,
//     "plutus_data": null,
//     "redeemers": null,
//     "plutus_v2_scripts": null,
//     "plutus_v3_scripts": null
//   },
//   "is_valid": true,
//   "auxiliary_data": null
// }
