import React, { useEffect } from "react";
import axios from "axios";

const Auth = () => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");
    if (code) {
      handleDiscordCallback(code).then(() => {
        window.close();
      });
    }
  }, []);

  const handleDiscordCallback = async (code) => {
    // Request access token from Discord using the authorization code
    const result = await axios.post("https://discord.com/api/oauth2/token", {
      client_id: process.env.test_client_id,
      client_secret: process.env.test_client_secret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/auth",
      scope: "identify",
    });

    // Use the access token to retrieve the user's Discord username and ID
    const userData = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        authorization: `Bearer ${result.data.access_token}`,
      },
    });
  };

  return <div></div>;
};

export default Auth;
