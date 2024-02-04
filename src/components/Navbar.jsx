import React, { useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export default function Navbar({ navBackground }) {
  const [{ userInfo }] = useStateProvider();
  const [showNotice, setShowNotice] = useState(true);
  const [showSecondNotice, setShowSecondNotice] = useState(false);
  const handleNoticeClick = () => {
    setShowNotice(false);
    setShowSecondNotice(true);
  };

  const handleSecondNoticeClick = () => {
    setShowSecondNotice(false);
  };

  return (
    <Container navBackground={navBackground}>
      {showNotice && (
        <Notice>
          <p>
            Open the Original Spotify with the same account and play a song and
            reload this page.
          </p>
          <button onClick={handleNoticeClick}>OK</button>
        </Notice>
      )}
      {showSecondNotice && (
        <Notice>
          <p>
            The Controlers and Clicked Songs won't work without premium for this
            account
          </p>
          <button onClick={handleSecondNoticeClick}>OK</button>
        </Notice>
      )}
      <div className="search__bar">
        <FaSearch />
        <input type="text" placeholder="Artists, songs, or podcasts" />
      </div>
      <div className="avatar">
        <a href={userInfo?.userUrl}>
          <CgProfile />
          <span>{userInfo?.name}</span>
        </a>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.7)" : "none"};
  .search__bar {
    background-color: white;
    width: 30%;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    input {
      border: none;
      height: 2rem;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
  }
  .avatar {
    background-color: black;
    padding: 0.3rem 0.4rem;
    padding-right: 1rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-weight: bold;
      svg {
        font-size: 1.3rem;
        background-color: #282828;
        padding: 0.2rem;
        border-radius: 1rem;
        color: #c7c5c5;
      }
    }
  }
`;

const Notice = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 5rem;
  button {
    background-color: #1db954;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 2rem;
  }
`;
