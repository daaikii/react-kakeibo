import React, { useState, useContext } from "react";
import { db } from "../firebase";
import { api } from "../api";
import { AuthContext } from "../context/userContext";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { IconButton, Box } from "@material-ui/core";

const Post: React.FC = () => {
  const [categorie, setCategorie] = useState("");
  const [expense, setExpense] = useState("");
  const [reciept, setReciept] = useState<File | null>(null);
  const [noFile, setNoFile] = useState(true);
  const [isNan, setIsNan] = useState(false);
  const user = useContext(AuthContext);

  const categorieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategorie(e.target.value);
  };

  const valueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(e.target.value))) {
      setExpense(e.target.value);
      setIsNan(false);
    } else {
      setIsNan(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setReciept(e.target.files![0]);
      setNoFile(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newdate = new Date();
    const timestamp =
      newdate.getFullYear() +
      "/" +
      (newdate.getMonth() + 1) +
      "/" +
      newdate.getDate();
    if (expense) {
      if (reciept) {
        /*
        本来は、pythoでgoogle-cloud-visionを使い情報を取る。
        const res = axios.get("/reciept", { params: reciept });  
        */
        const res = api(reciept);
        db.collection("posts").add({
          categorie: categorie,
          expense: res.total_price,
          timestamp: timestamp,
          uid: user.uid,
        });
        return;
      }
      db.collection("posts").add({
        categorie: categorie,
        expense: expense,
        timestamp: timestamp,
        uid: user.uid,
      });
    }
    setCategorie("");
    setExpense("");
  };

  return (
    <form className="yform" onSubmit={handleSubmit}>
      <h4>入力フォーム</h4>
      <div className="form-list">
        <div>
          <label>カテゴリー</label>
        </div>
        <input
          type="text"
          id="categorie"
          name="categorie"
          value={categorie}
          onChange={categorieChange}
          className="form-input"
        />
        <div>
          <label>金額</label>
        </div>
        <input
          type="text"
          id="expense"
          name="expense"
          value={expense}
          onChange={valueChange}
          className="form-input"
        />
        <Box textAlign="center">
          <IconButton>
            <label>
              <AddAPhotoIcon />
              <input
                className="form-filebtn"
                type="file"
                onChange={handleChange}
              />
            </label>
          </IconButton>
        </Box>
      </div>
      <button
        className="form-button"
        onClick={() => {
          setReciept(null);
          setNoFile(true);
        }}
        disabled={noFile}
      >
        fileを取り消す
      </button>
      <button
        type="submit"
        disabled={(!categorie || !expense) && (!categorie || noFile)}
        className="form-button"
      >
        保存
      </button>
      {expense && !noFile && (
        <p>
          金額、写真を入れた場合、<br></br>写真が優先されます
        </p>
      )}
      <span style={{ display: isNan ? "inline" : "none" }}>
        ＊数値を入力してください
      </span>
    </form>
  );
};

export default Post;
