# switchboard-demo

Simple TypeScript demo for reading a Switchboard on-demand price feed on Solana.

## Usage

1. Install dependencies:

```bash
npm install
```

2. Configure your environment. The Switchboard SDK auto-detects the network. At minimum you need a Solana keypair and RPC URL (e.g. via standard Anchor/Solana env vars like `ANCHOR_WALLET` and `ANCHOR_PROVIDER_URL`).

3. Run the demo:

```bash
npm run demo
```

The script lives at `src/oracle-demo.ts` and mirrors the on-chain update + read flow from the Switchboard documentation.
