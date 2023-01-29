import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function SignIn() {
  const { connected, wallet } = useWallet();
  const [hasPolicyIdAssets, setHasPolicyIdAssets] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    const checkPolicyIdAssets = async () => {
      if (connected) {
        setLoading(true);
        const assets = await wallet.getPolicyIdAssets("ec9cf0f7a70dd8ebf825772a85f22ed70ec14dec0f76c4e4b5b0eff7")
        if (assets.length) {
          setHasPolicyIdAssets(true);
        }
        setLoading(false);
      }
    };
    checkPolicyIdAssets();
  }, [connected]);

  // 1. The user is signed into discord and connected to wallet.
  if (session && connected && hasPolicyIdAssets) {
    return (
      <div>
        <a onClick={() => signOut()}>
          Sign out of Discord
        </a>
      </div>
    );
  }

  // 2. Connect Wallet
  if (!connected) {
    return (
      <div>
        <h2>Connect Your Wallet</h2>
        <p>Connect your wallet to check eligibility.</p>
        <CardanoWallet />
      </div>
    );
  }

  // 3. Connect with Discord (OAuth)
  if (!session) {
    return (
      <div>
        <h2>Sign In with Discord</h2>
        <p>Sign In with Discord to check your eligibility for the NFT!</p>

        <button
          onClick={() => signIn("discord")}
         
        >
          Connect Discord
        </button>
      </div>
    );
  }

  // 4. Check for policy id assets
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasPolicyIdAssets) {
    return <div>You don't have our NFT</div>
  }

  return null;
}
