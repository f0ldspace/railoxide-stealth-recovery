// Derive a RailOxide stealth account's private key from your recovery phrase.
// Run OFFLINE:  npm i ethers@6  &&  node derive-stealth-account.mjs
// Path used by RailOxide (railgun-rust derive_executor_signer):
//   m/44'/60'/0'/7702'/<railgun index>'/<chain id>'/<account #>'
import { HDNodeWallet } from "ethers";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const phrase = (await rl.question("Recovery phrase: ")).trim();
const passphrase = await rl.question("BIP-39 passphrase (blank if none): ");
const chainId = Number(await rl.question("Chain ID (1 = Ethereum, 42161 = Arbitrum, 137 = Polygon, 56 = BSC): "));
const account = Number(await rl.question("Stealth account # (as shown in RailOxide): "));
const railgunIndex = Number((await rl.question("RAILGUN wallet index [0]: ")) || 0);
rl.close();

const path = `m/44'/60'/0'/7702'/${railgunIndex}'/${chainId}'/${account}'`;
const wallet = HDNodeWallet.fromPhrase(phrase, passphrase, path);

console.log(`\nPath:        ${path}`);
console.log(`Address:     ${wallet.address}   <- must match the address RailOxide shows`);
console.log(`Private key: ${wallet.privateKey}`);
