//PlayerControls:
import React, { useState } from "react";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { LuRepeat1 } from "react-icons/lu";

import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
export default function PlayerControls() {
  const [{ token, playerState }, dispatch] = useStateProvider();
  const [repeatMode, setRepeatMode] = React.useState("off");
  const [repeatClickCount, setRepeatClickCount] = React.useState(0);
  const [shuffleState, setShuffleState] = useState(false);

  const changeState = async () => {
    try {
      const state = playerState ? "pause" : "play";
      await axios.put(
        `https://api.spotify.com/v1/me/player/${state}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      dispatch({
        type: reducerCases.SET_PLAYER_STATE,
        playerState: !playerState,
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const changeTrack = async (types) => {
    try {
      await axios.post(
        `https://api.spotify.com/v1/me/player/${types}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });

      const response1 = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response1.data !== "") {
        const currentPlaying = {
          id: response1.data.item.id,
          name: response1.data.item.name,
          artists: response1.data.item.artists.map((artist) => artist.name),
          image: response1.data.item.album.images[2].url,
        };
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
      } else {
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRepeatClick = async () => {
    try {
      let newRepeatMode;
      let newRepeatClickCount = repeatClickCount;

      if (repeatClickCount === 0) {
        newRepeatMode = "context";
        newRepeatClickCount = 1;
      } else if (repeatClickCount === 1) {
        newRepeatMode = "track";
        newRepeatClickCount = 2;
      } else {
        newRepeatMode = "off";
        newRepeatClickCount = 0;
      }

      await axios.put(
        `https://api.spotify.com/v1/me/player/repeat?state=${newRepeatMode}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setRepeatMode(newRepeatMode);
      setRepeatClickCount(newRepeatClickCount);
    } catch (error) {
      handleApiError(error);
    }
  };

  const toggleShuffle = async () => {
    try {
      const newShuffleState = !shuffleState;

      await axios.put(
        `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setShuffleState(newShuffleState);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    console.error("Error response:", error.response);

    if (error.response && error.response.status === 403) {
      // Handle 403 error (e.g., redirect to login page)
      console.error("User is not authorized. Redirecting to login page.");
      // You can redirect the user to a login page or perform any other action here
    } else {
      console.error("Generic API error:", error);
    }

    throw error;
  };

  return (
    <Container>
      <div className="shuffle" onClick={toggleShuffle}>
        <BsShuffle style={{ color: shuffleState ? "#1db954" : "#b3b3b3" }} />
      </div>
      <div className="previous">
        <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
      </div>
      <div className="state">
        {playerState ? (
          <BsFillPauseCircleFill onClick={changeState} />
        ) : (
          <BsFillPlayCircleFill onClick={changeState} />
        )}
      </div>
      <div className="next">
        <CgPlayTrackNext onClick={() => changeTrack("next")} />
      </div>
      <div className="repeat" onClick={handleRepeatClick}>
        {repeatMode === "off" ? (
          <FiRepeat />
        ) : repeatMode === "track" ? (
          <LuRepeat1 style={{ color: "#1db954" }} />
        ) : (
          <FiRepeat style={{ color: "#1db954" }} />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
      color: white;
      cursor: pointer;
    }
    &:active {
      transform: scale(0.9);
    }
  }
  .state {
    svg {
      color: white;
    }
  }
  .previous,
  .next,
  .state {
    font-size: 2rem;
  }
  .seek__bar {
    display: flex;
    flex-direction: column;
  }
`;
