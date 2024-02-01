// playlists
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

export default function Playlists() {
  const [{ token, playlists }, dispatch] = useStateProvider();
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        const { items } = response.data;
        const fetchedPlaylists = items.map(({ name, id }) => {
          return { name, id };
        });
        dispatch({ type: reducerCases.SET_PLAYLISTS, playlists: fetchedPlaylists });
        setLoginError(false);
      } catch (error) {
        console.error("Error fetching playlists:", error);

        // Check if the error is due to user not being registered
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 403
        ) {
          const errorMessage = error.response.data.error.message;
          if (
            errorMessage.includes(
              "User not registered in the Developer Dashboard"
            )
          ) {
            // Handle the case where the user is not registered
            setLoginError(true);
          } else {
            console.error("Unexpected error during playlist fetch:", error);
          }
        } else {
          console.error("Unexpected error during playlist fetch:", error);
        }
      }
    };

    getPlaylistData();
  }, [token, dispatch]);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });
  };

  return (
    <Container>
      <ul>
        {loginError && (
          // Display default playlists if there's a login error
          <>
            <li onClick={() => changeCurrentPlaylist("golden")}>Golden</li>
            <li onClick={() => changeCurrentPlaylist("D_Day")}>D-Day</li>
            <li onClick={() => changeCurrentPlaylist("Face")}>Face</li>
          </>
        )}
        {!loginError &&
          playlists.map(({ name, id }) => (
            <li key={id} onClick={() => changeCurrentPlaylist(id)}>
              {name}
            </li>
          ))}
      </ul>
    </Container>
  );
}


const Container = styled.div`
  color: #b3b3b3;
  height: 100%;
  overflow: hidden;
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 55vh;
    max-height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.7rem;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
    li {
      transition: 0.3s ease-in-out;
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
`;
