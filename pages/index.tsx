import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useWallet, useAddress} from '@meshsdk/react';
import { CardanoWallet, useAuth } from '@meshsdk/react';
import { useClient } from '@meshsdk/core';
import SignIn from "../components/SignIn";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
    const { connected, wallet } = useWallet();
    const  address  = useAddress();
    const [hasPolicyIdAssets, setHasPolicyIdAssets] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const { auth } = useAuth();
    const { client } = useClient();

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

    async function requestGrantRole() {
        // First, login 
        const domain = "example.com";
        const loginPayload = await auth.login(address, { domain });

        // Then make a request to our API endpoint.
        try {
            const response = await client.request("POST", "/api/grant-role", {
                body: JSON.stringify({
                    loginPayload,
                }),
            });
            console.log(response);
            alert("Check the console for the response!");
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <div>
                <SignIn />

                {address && session && (
                    <div>
                        <button  onClick={requestGrantRole}>
                            Give me the role!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
