import React from "react";
import { Typography } from "@material-ui/core";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";

const Home: React.FC = () => {
  return (
    <div className="container home">
      <div className="home-wrapper">
        <div className="home-main">
          <Typography variant="h4" className="home-text">
            HAB
          </Typography>
          <LocalAtmIcon className="home-icon" />
        </div>
        <div className="home-message">
          <h1>
            このアプリは<br></br>家計簿アプリです
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
