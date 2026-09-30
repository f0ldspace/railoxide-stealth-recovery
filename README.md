# railoxide-stealth-recovery

A tiny Node script that recovers the private key of a [RailOxide](https://github.com/triamazikamno/railoxide) stealth account from your recovery phrase.

Heads up: this was vibecoded. I had a problem, described it to an LLM, checked the output against the RailOxide source, and it worked. It's ~25 lines and there's nothing clever in it, but you should still read it before you paste your seed phrase into it. That's kind of the whole point of this thing being small.

## Why this exists

RailOxide is a Rust desktop wallet for RAILGUN. When it does EIP-7702 style self-broadcasting it uses "stealth accounts" — throwaway EOAs derived from your seed that act as the executor/sender for the transaction. The app shows you the address, but it doesn't (as of when I wrote this) give you a button to export the key for that account.

Which is fine, until you end up with some dust or leftover gas sitting on one of those addresses and you want to sweep it from MetaMask / cast / whatever. Or you just want to know you *can* get at it without RailOxide.

The good news is the derivation is fully deterministic and lives in `railgun-rust` (`derive_executor_signer` in `crates/railgun-wallet/src/keys.rs`). It's a plain BIP-32 path, so any BIP-39/BIP-32 library can reproduce it:

```
m/44'/60'/0'/7702'/<railgun wallet index>'/<chain id>'/<account #>'
```

Every segment is hardened. That's it, that's the entire secret.

## Usage

Do this **offline**. Seriously — live USB, airgapped laptop, at minimum pull the wifi. You're typing a seed phrase into a terminal.

```sh
npm i ethers@6
node derive-stealth-account.mjs
```

It'll ask you for:

- your recovery phrase
- your BIP-39 passphrase (just hit enter if you don't use one)
- chain ID (`1` Ethereum, `42161` Arbitrum, `137` Polygon, `56` BSC)
- the stealth account number as RailOxide shows it
- the RAILGUN wallet index (almost certainly `0`, just hit enter)

and prints the path, the address, and the private key.

**Check the address matches what RailOxide shows you before you trust the key.** If it doesn't match, you've probably got the wrong account number, wrong chain, or a passphrase mismatch — the key printed is for *some* account, just not the one you wanted. No harm done, try again.

## What it doesn't do

- It doesn't touch your 0zk / RAILGUN private balance at all. Those keys are derived completely differently and this script knows nothing about them.
- It doesn't talk to the network. No RPC, no nothing. `ethers` is only used for the HD wallet math.
- It doesn't save anything. Output goes to stdout and that's it — clear your terminal scrollback when you're done.

## Disclaimer

This is a personal utility I threw together for myself. No warranty, do what you want with it, and I'm not responsible if you lose funds, leak your seed, or fat-finger a chain ID. If RailOxide changes the derivation path this script will silently produce the wrong key (well, the address check will catch it, but still). Verify against the source if in doubt.

Ideally RailOxide grows an "export stealth account key" button at some point and this repo becomes pointless. That'd be the best outcome.
