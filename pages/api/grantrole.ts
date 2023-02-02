// import { useClient, useAuth } from '@meshsdk/core';
import { getServerSession } from "next-auth/next";
import useClient from "next-auth"
import useAuth from "next-auth"
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function grantRole(req: NextApiRequest, res: NextApiResponse) {
    // Get the login payload out of the request
    console.log(req.body);
    const { loginPayload } = JSON.parse(req.body);

    // Get the Next Auth session so we can use the user ID as part of the discord API request
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        res.status(401).json({ error: "Not logged in" });
        return;
    }

    const auth = useAuth();
    const client = useClient();
    // Authenticate login payload
    const domain = "example.com";
    // Verify the login payload is real and valid
    const verifiedWalletAddress = auth.verify(domain, loginPayload);

    // If the login payload is not valid, return an error
    if (!verifiedWalletAddress) {
        res.status(401).json({ error: "Invalid login payload" });
        return;
    }

    // Check if this user owns an NFT
    const policyId = "ec9cf0f7a70dd8ebf825772a85f22ed70ec14dec0f76c4e4b5b0eff7"
    const assets = await client.request("GET", `/api/assets/${policyId}/${verifiedWalletAddress}`);
    if (assets.length) {
        // Make a request to the Discord API to get the servers this user is a part of
        const discordServerId = "1049415758343577731";

        // @ts-ignore
        const { userId } = session;

        console.log(userId)

        const roleId = "1067848368719675393";
        console.log(`https://discordapp.com/api/guilds/${discordServerId}/members/${userId}/roles/${roleId}`)
        const response = await client.request("PUT", `/api/guilds/${discordServerId}/members/${userId}/roles/${roleId}`, {
            headers: {
                // Use the bot token to grant the role
                Authorization: `Bot ${process.env.BOT_TOKEN}`,
            }
        });

        // If the role was granted, return the content
        if (response.status === 200) {
            res.status(200).json({ message: "Role granted" });
        }

          // Something went wrong granting the role, but they do have an NFT
          else {
            const resp = await response.json();
            console.error(resp);
            res
                .status(500)
                .json({ error: "Error granting role, are you in the server?" });
        }
    } else {
        res.status(401).json({ error: "User does not have an NFT"});
	}
}