import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import GOLDEN from "../images/GOLDEN.png";
export default function CurrentTrack() {
  const [{ token, currentPlaying }, dispatch] = useStateProvider();

  // Define a default track
  const defaultTrack = {
    id: "hate_you",
    name: "Hate You",
    artists: ["Jung Kook"],
    image: GOLDEN,
  };

  useEffect(() => {
    const getCurrentTrack = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data !== "") {
          const currentPlaying = {
            id: response.data.item.id,
            name: response.data.item.name,
            artists: response.data.item.artists.map((artist) => artist.name),
            image: response.data.item.album.images[2].url,
          };
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
        } else {
          // If no currently playing track, use the default track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: defaultTrack });
        }
      } catch (error) {
        console.error("Error fetching currently playing track:", error);

        // If an error occurs, use the default track
        if (error.response && error.response.status === 403) {
          console.error("Authorization error. Displaying default track.");
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: defaultTrack });
        }
      }
    };

    getCurrentTrack();
  }, [token, dispatch]);

  return (
    <Container>
      {currentPlaying && (
        <div className="track">
          <div className="track__image">
            <img src={currentPlaying.image} alt={currentPlaying.name} />
          </div>
          <div className="track__info">
            <h4 className="track__info__track__name">{currentPlaying.name}</h4>
            <h6 className="track__info__track__artists">
              {currentPlaying.artists.join(", ")}
            </h6>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;

    &__image {
      img {
        height: 50px; // Adjust the height as needed
        width: 50px; // Adjust the width as needed
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;

      &__track__name {
        color: white;
      }

      &__track__artists {
        color: #b3b3b3;
      }
    }
  }
`;