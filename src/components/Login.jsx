// login:
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

export default function Login() {
  const [loginError, setLoginError] = useState(false);

  const handleClick = async () => {
    const client_id = "361aee247b75456d930bdfbc6c29b807";
    const redirect_uri = "https://spotify-clone16.netlify.app/";
    const api_uri = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-private",
      "user-read-email",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
    ];

    try {
      window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
        " "
      )}&response_type=token&show_dialog=true`;
    } catch (error) {
      // Check if the error is due to user not being registered
      if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
        const errorMessage = error.response.data.error.message;
        if (errorMessage.includes("User not registered in the Developer Dashboard")) {
          // Handle the case where the user is not registered
          setLoginError(true);
        } else {
          console.error("Unexpected error during login:", error);
        }
      } else {
        console.error("Unexpected error during login:", error);
      }
    }
  };

  return (
    <Container>
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png"
        alt="spotify"
      />
      {loginError ? (
        <p>Error: User not registered in the Developer Dashboard</p>
      ) : (
        <button onClick={handleClick}>Connect Spotify</button>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #1db954;
  gap: 5rem;
  img {
    height: 20vh;
  }
  button {
    padding: 1rem 5rem;
    border-radius: 5rem;
    background-color: black;
    color: #49f585;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
  }
  p {
    color: red;
    font-size: 1.4rem;
  }
`;
