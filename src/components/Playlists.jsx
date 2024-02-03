// playlists
import axios from "axios";
import React, { useEffect } from "react";
import styled from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

export default function Playlists() {
  const [{ token, playlists }, dispatch] = useStateProvider();

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
        const playlists = items.map(({ name, id }) => {
          return { name, id };
        });
        dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
      } catch (error) {
        console.error("Error fetching playlists:", error);

        // If there's an error with a status code of 403, display default playlists
        if (error.response && error.response.status === 403) {
          console.error("Authorization error. Displaying default playlists.");

          const defaultPlaylists = [
            { name: "Golden", id: "golden" },
            { name: "D-Day", id: "D_Day" },
            { name: "Face", id: "Face" },
            // Add more default playlists as needed
          ];

          dispatch({ type: reducerCases.SET_PLAYLISTS, playlists: defaultPlaylists });
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
        {playlists.length === 0 && (
          // Display default playlists if no playlists are fetched
          <>
            <li onClick={() => changeCurrentPlaylist("golden")}>Golden</li>
            <li onClick={() => changeCurrentPlaylist("D_Day")}>D-Day</li>
            <li onClick={() => changeCurrentPlaylist("Face")}>Face</li>
            {/* Add more default playlists as needed */}
          </>
        )}
        {playlists.map(({ name, id }) => (
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
