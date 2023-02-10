import axios from "axios";

const handleDiscordCallback = async (code) => {
  
  //this sets variables from your .env file
  const client_id = process.env.REACT_APP_test_client_id;
  const client_secret = process.env.REACT_APP_test_client_secret;
  const redirect_uri = process.env.REACT_APP_test_redirect_uri;
 
  
//this sets the variables needed for an auth api call to discord
  const payload = new URLSearchParams();
  payload.append("client_id", client_id);
  payload.append("client_secret", client_secret);
  payload.append("grant_type", "authorization_code");
  payload.append("code", code.replace("?code=", ""));
  payload.append("redirect_uri", redirect_uri);
  payload.append("scope", "identify");

  console.log(payload);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };

  //this is the actual api call, it trades the code we got for an access token
  const result = await axios.post(
    "https://discord.com/api/oauth2/token",
    payload,
    { headers }
  );

  const accessToken = result.data.access_token;

  // Use the access token to retrieve the user's Discord username and ID
  const userData = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  
  const message = { type: "discord_auth", data: userData };
  window.opener.postMessage(JSON.stringify(message), "http://localhost:3000");
  //closes the tab
  window.close();
};

export default handleDiscordCallback;
