//volume
import axios from "axios";
import React from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";

export default function Volume() {
  const [{ token }] = useStateProvider();

  const setVolume = async (e) => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/volume",
        {},
        {
          params: {
            volume_percent: parseInt(e.target.value),
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error("Authorization error. Setting default volume.");

        // Set default volume (e.g., 50) when a 403 error occurs
        await axios.put(
          "https://api.spotify.com/v1/me/player/volume",
          {},
          {
            params: {
              volume_percent: 50, // Set your default volume here
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
      } else {
        console.error("Error setting volume:", error);
      }
    }
  };

  return (
    <Container>
      <input type="range" onMouseUp={(e) => setVolume(e)} min={0} max={100} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-content: center;
  input {
    width: 8rem;
    border-radius: 2rem;
    height: 0.4rem;
  }
`;