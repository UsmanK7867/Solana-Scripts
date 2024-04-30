

const anchor = require('@project-serum/anchor');
// const web3 = require('@solana/web3.js');
// const { AnchorProvider } = require('@project-serum/anchor');
const fs = require('fs');

async function initializeAccount() {
    try {
        // Generate a new keypair
        // const payerAccount = web3.Keypair.generate();
        const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('devnet'), 'confirmed');

        //     // Generate a new keypair for the signer (or use an existing keypair)
            const signerr = anchor.web3.Keypair.fromSecretKey(new Uint8Array( [
                172, 101,  32,  34,  10, 250,  84,  96,  42,  68, 134,
                195,  36,  64, 213,  16, 106,  37, 208, 179,  31, 229,
                235, 126,  45, 237,  13, 225, 172, 194, 114, 128,  38,
                145,  76, 125,  54,   1, 208, 191, 225, 234, 101,  88,
                179,  52, 100, 247, 135,  80, 238, 223, 114, 183,   0,
                 97,   2, 193,   6,  10,  51, 188, 196, 182
              ]));
            
            
            // Create an Anchor wallet object
            const signer = new anchor.Wallet(signerr);
        // Initialize a new account
        const newAccount = anchor.web3.Keypair.generate();

        // Initialize program client
        // const provider = new AnchorProvider(connection, '3bYzjrW1FXSdT35h2kCeSQbYqJkfi7yDqZDds9G7gd8y', 'confirmed');
        const provider = new anchor.AnchorProvider(connection, signer, {
            preflightCommitment: "confirmed"
        });
        
        const idl = JSON.parse(fs.readFileSync('idl.json', 'utf8'));

//         // Load the program from IDL
        const programId = new anchor.web3.PublicKey('LqVmKsuc5npsWH5PTxTQnk2nZFZgVSUf9byga2sD5xy');
        const program = new anchor.Program(idl, programId, provider);
        console.log("program",program.methods)
        console.log("program",newAccount.publicKey.toBase58())

// // 2 - Fetch latest blockhash
        let latestBlockhash = await connection.getLatestBlockhash("finalized")

// const tx = await program.methods
//   .initialize(new anchor.BN(123))
//   // 3a - Pass the counter public key into our accounts context
//   .accounts({newAccount: newAccount.publicKey,signer:signer.publicKey})
//   // 3b - Append the counter keypair's signature to transfer authority to our program
//   .signers([signer.payer])
//   .rpc();
  

const tx = await program.rpc.initialize({
    accounts: {
        newAccount: newAccount.publicKey,
        signer: signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [ signer.payer,newAccount],
});
// 4 - Confirm the transaction

let c=await connection.confirmTransaction({
  signature: tx,         
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
});

console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`); 
    

    //     // Fetch the created account
        const createdAccount = await program.account.newAccount.fetch(newAccount.publicKey);

        console.log("On-chain data is:", createdAccount.data.toString());

    //     // Check whether the data on-chain is equal to local 'data'
    //     assert(data === createdAccount.data); // Note: Use === for comparison
    } catch (error) {
        console.error('Error initializing account:', error);
    }
}

initializeAccount().catch(console.error);
