import React, { useEffect, useContext } from "react";
import Home from "./components/Home";
import Auth from "./components/Auth";
import Feed from "./components/Feed";
import Header from "./components/Header";
import { auth } from "./firebase";
import { useLogin, useLogout, AuthContext } from "./context/userContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App: React.FC = () => {
  const user = useContext(AuthContext);
  const login = useLogin();
  const logout = useLogout();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser: any) => {
      if (authUser) {
        login(authUser);
      } else {
        logout();
      }
    });
    return () => unSub();
  }, [useLogin || useLogout]);

  return (
    <>
      <Router>
        {user.uid ? (
          <Feed />
        ) : (
          <>
            <Header />
            <Switch>
              <Route exact path="/auth" component={Auth} />
              <Route path="/" component={Home} />
            </Switch>
          </>
        )}
      </Router>
    </>
  );
};

export default App;
