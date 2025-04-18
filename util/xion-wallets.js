import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // Import Firebase setup


// Generate Wallet & Store in Firebase
export async function createAndStoreWallet(userId) {
  const wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: "xion" });
  const [account] = await wallet.getAccounts();

  // Store wallet in Firestore
  await addDoc(collection(db, "wallets"), {
    userId,
    address: account.address,
    mnemonic: wallet.mnemonic, // ⚠ Store securely in a real app!
    createdAt: new Date()
  });

  return {
    address: account.address,
    mnemonic: wallet.mnemonic, // Return for user backup
  };
}
