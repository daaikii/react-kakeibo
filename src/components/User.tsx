import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Box,
  Modal,
  Button,
  IconButton,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { auth, storage } from "../firebase";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const User: React.FC = () => {
  const [username, setUsername] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const user = firebase.auth().currentUser;
  const history = useHistory();

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };
  const deleteAcount = () => {
    if (window.confirm("削除しますか？")) {
      user?.delete().catch((err) => {
        alert(err.message);
      });
    } else {
      alert("キャンセルしました");
    }
  };
  const handleUpdate = async () => {
    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;
      await storage
        .ref(`avatars/${fileName}`)
        .put(avatarImage)
        .catch((error) => {
          alert(error);
        });
      url = await storage
        .ref("avatars")
        .child(fileName)
        .getDownloadURL()
        .catch((error) => {
          alert(error);
        });
    }
    await user
      ?.updateProfile({
        displayName: username,
        photoURL: url,
      })
      .catch((error) => {
        alert(error);
      });
    history.push("/");
  };

  return (
    <Grid
      item
      xs={8}
      sm={8}
      md={6}
      component={Paper}
      elevation={2}
      square
      className="freearound"
    >
      <div className="login">
        <Avatar className="login-avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          編集
        </Typography>
        <form>
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
              }}
            />
            <Box textAlign="center">
              <IconButton>
                <label>
                  userIcon
                  <AddAPhotoIcon
                    fontSize="large"
                    className={
                      avatarImage ? "login-loadIcon" : "login-nomalIcon"
                    }
                  />
                  <input
                    className="login-filebtn"
                    type="file"
                    onChange={onChangeImageHandler}
                  />
                </label>
              </IconButton>
            </Box>
          </>
        </form>

        <span onClick={() => setOpenModal(true)}>Reset password?</span>
        <Button
          disabled={!username || !avatarImage}
          fullWidth
          variant="contained"
          color="primary"
          className="login-button"
          startIcon={<EmailIcon />}
          onClick={handleUpdate}
        >
          Update
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="login-button"
          onClick={deleteAcount}
        >
          Delete
        </Button>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div className="modal">
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              type="email"
              name="email"
              label="Reset E-mail"
              value={resetEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setResetEmail(e.target.value);
              }}
            />
            <IconButton onClick={sendResetEmail}>
              <SendIcon />
            </IconButton>
          </div>
        </Modal>
      </div>
    </Grid>
  );
};

export default User;
