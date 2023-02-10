import { CardanoWallet, useWallet, useAssets } from "@meshsdk/react";
import { useEffect, useState } from "react";
import "./App.css";
import handleDiscordCallback from "./handleDiscordCallback";

function App() {
  const client_id = process.env.REACT_APP_test_client_id;
  const redirect_uri = process.env.REACT_APP_test_redirect_uri;
  const [DiscordAuth, setDiscordAuth] = useState();
  console.log("state: ", DiscordAuth);

  //in this function you will write the code to send the api call to actually give the role
  async function GiveRole() {
    console.log("clicked: ", DiscordAuth);
  }

  //this listens for discord information sent from the pop up auth page
  window.addEventListener("message", function handleMessage(event) {
    if (typeof event.data === "string") {
      let message = JSON.parse(event.data);
      if (message.type === "discord_auth") {
        setDiscordAuth(event.data);
      }
    }
  });

  //this opens the new tab where users will auth their discord, when the user clicks authorize it will redirect back here with a code from discord
  const handleDiscordLogin = async () => {
    const authWindow = window.open(
      "https://discord.com/api/oauth2/authorize?" +
        new URLSearchParams({
          client_id: client_id,
          redirect_uri: redirect_uri,
          response_type: "code",
          scope: "identify",
        }).toString(),
      "_blank"
    );
  };

  //these get the information from mesh
  const wallet = useWallet();
  const assets = useAssets();

  //you dont need this, it logs the name of connected wallets for test purposes
  useEffect(() => {
    console.log("name of connected wallet: ", wallet.name);
  }, [wallet.connected]);

  //you dont need this, it logs the assets in a wallet for test purposes
  useEffect(() => {
    console.log("assets: ", assets);
  }, [assets]);

  //this block checks the url of the page for /auth, its what makes the pop up work
  {
    /* eslint-disable no-restricted-globals  */
  }
  if (location.pathname === "/auth") {
    handleDiscordCallback(location.search);
  }

  return (
    <div>
      {/* this is the connect button provided by mesh */}
      <CardanoWallet />
      <div>
        {/* this is a ternary operator, an if statement for displaying something. if a wallet is connected, the discord button shows up */}
        {assets ? (
          wallet.connected ? (
            <button onClick={handleDiscordLogin}>Login with Discord</button>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
      <br />
      <br />
      {/* another ternary operator, if 'assets' exists (a wallet is connected) AND discord auth information exists, it displays a button to get roles */}
      {/* you will need to add some logic to make sure the asset you want is in the wallet */}
      {assets && DiscordAuth ? (
        <button onClick={() => GiveRole()}>Click for Roles</button>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
