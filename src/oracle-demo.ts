import * as sb from "@switchboard-xyz/on-demand";
import { OracleQuote } from "@switchboard-xyz/on-demand";

const FEED_ID =
  "4cd1cad962425681af07b9254b7d804de3ca3446fbfd1371bb258d2c75059812";

async function main() {
  const { program, keypair, connection, crossbar, queue } =
    await sb.AnchorUtils.loadEnv();

  console.log("Queue:", queue.pubkey.toBase58());
  console.log("Network:", crossbar.getNetwork());

  const [quoteAccount] = OracleQuote.getCanonicalPubkey(queue.pubkey, [FEED_ID]);
  console.log("Quote Account:", quoteAccount.toBase58());

  const simResult = await crossbar.simulateFeed(FEED_ID);
  console.log("Simulated feed result:", simResult);

  const updateInstructions = await queue.fetchManagedUpdateIxs(
    crossbar,
    [FEED_ID],
    {
      variableOverrides: {},
      instructionIdx: 0,
      payer: keypair.publicKey,
    }
  );

  const readOracleIx = await program.methods
    .readOracleData()
    .accounts({
      quoteAccount,
    })
    .instruction();

  const tx = await sb.asV0Tx({
    connection,
    ixs: [...updateInstructions, readOracleIx],
    signers: [keypair],
    computeUnitPrice: 20_000,
    computeUnitLimitMultiple: 1.1,
  });

  const sim = await connection.simulateTransaction(tx);
  console.log(sim.value.logs?.join("\n"));

  if (!sim.value.err) {
    const sig = await connection.sendTransaction(tx);
    console.log("Transaction:", sig);
  }
}

main();
