import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/userContext";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";
import { AppBar, Avatar, Toolbar, Button, Typography } from "@material-ui/core";
import DehazeIcon from "@material-ui/icons/Dehaze";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useContext(AuthContext);
  const menuRef: any = useRef();
  const history = useHistory();

  const handleLogout = async () => {
    await auth.signOut();
  };
  const handleLogin = () => {
    history.push("/auth");
  };

  const handleChangeIndex = () => {
    history.push("/");
  };
  const changeUser = () => {
    history.push("/user");
  };
  const changePosts = () => {
    history.push("/posts");
  };
  useEffect(() => {
    isOpen && menuRef.current.focus();
  }, [isOpen]);

  return (
    <>
      <AppBar elevation={0} position="static">
        <Toolbar className="header">
          <Button onClick={handleChangeIndex}>
            <Typography variant="h4">Hab</Typography>
            <LocalAtmIcon />
          </Button>
          {user.uid ? (
            <Button
              color="default"
              aria-label="menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <DehazeIcon fontSize="large" />
            </Button>
          ) : (
            <Button onClick={handleLogin}>
              <Typography>Login</Typography>
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isOpen && (
        <ul
          className="header-list"
          onBlur={() => setIsOpen(false)}
          ref={menuRef}
          tabIndex={1}
        >
          <div className="header-listuser" onClick={changeUser}>
            <Avatar src={user.photoURL}></Avatar>
            <p>{user.displayName}</p>
          </div>
          <li className="header-listitems" onClick={changePosts}>
            入力フォーム
          </li>
          <li className="header-listitems" onClick={handleLogout}>
            ログアウト
          </li>
        </ul>
      )}
    </>
  );
};

export default Header;
