import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";

  
  const suppliedToPubkey = "7MmNDE9miYyRsGTjumBWUQWSnQKfgwMQFjgQoPx2oR8x";
  
  if (!suppliedToPubkey) {
    console.log(`Please provide a public key to send to`);
    process.exit(1);
  }
  
  const sender = Keypair.fromSecretKey(new Uint8Array( [59,171,46,124,116,42,104,60,26,243,218,89,23,89,114,50,7,206,76,240,111,18,242,77,102,155,190,78,108,201,22,252,113,25,6,78,50,217,151,245,206,75,157,182,239,50,169,193,217,122,59,211,91,101,244,56,63,88,93,45,182,2,88,19]));



  console.log(`suppliedToPubkey: ${suppliedToPubkey}`);
  
  const toPubkey = new PublicKey(suppliedToPubkey);
  
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`,sender.publicKey.toString()
  );

  const transaction = new Transaction()

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: toPubkey,
  lamports: 10
})

transaction.add(sendSolInstruction)

const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]
  )

  console.log("https://explorer.solana.com/tx/"+signature+"?cluster=devnet");