import React from "react";
import Header from "./Header";
import Index from "./Index";
import User from "./User";
import Posts from "./Posts";
import Show from "./Show";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DataProvider from "../context/dataContext";

const Feed: React.FC = () => {
  return (
    <>
      <DataProvider>
        <Router>
          <Header />
          <Switch>
            <Route path="/user" component={User} />
            <Route path="/posts" component={Posts} />
            <Route path="/show" component={Show} />
            <Route path="/" component={Index} />
          </Switch>
        </Router>
      </DataProvider>
    </>
  );
};

export default Feed;
