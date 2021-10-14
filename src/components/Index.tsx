import React, { useState, useContext } from "react";
import Post from "../components/Post";
import Chart from "./Chart";
import Pergraph from "./Pergraph";
import { db } from "../firebase";
import { Modal, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { DataContext, useSetShowId } from "../context/dataContext";

type DOC = {
  id: string;
  expenses: { categorie: string; expense: string }[];
  categorie: string;
  expense: string;
  timestamp: any;
};

const Index: React.FC = () => {
  const data = useContext(DataContext).data;
  const setshowid = useSetShowId();
  const [docId, setDocId] = useState("");
  const [showCategorie, setShowCategorie] = useState("");
  const [showExpense, setShowExpense] = useState("");
  const [isNan, setIsNan] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();

  const handleClick = async (doc: DOC) => {
    if (doc.expenses) {
      setshowid(doc.id);
      history.push("/show");
    } else {
      setDocId(doc.id);
      const docRef = db.collection("posts").doc(doc.id);
      const docData = await docRef.get();
      if (docData.exists) {
        setShowCategorie(docData.data()?.categorie);
        setShowExpense(docData.data()?.expense);
        setOpenModal(true);
      } else {
        console.log("データを受け取っていません");
      }
    }
  };

  const handleCategorieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowCategorie(e.target.value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(e.target.value))) {
      setShowExpense(e.target.value);
      setIsNan(false);
    } else {
      setIsNan(true);
    }
  };

  const showSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection("posts")
      .doc(docId)
      .update({
        categorie: showCategorie,
        expense: showExpense,
      })
      .catch((error: any) => {
        alert(error);
      });
    setShowCategorie("");
    setShowExpense("");
    setOpenModal(false);
  };

  const handleDelete = () => {
    db.collection("posts")
      .doc(docId)
      .delete()
      .catch((error: any) => {
        alert(error);
      });
    setOpenModal(false);
  };

  return (
    <div className="container">
      <Grid container justify="center">
        <Grid item className="item" lg={5}>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>カテゴリー</th>
                <th>金額</th>
              </tr>
            </thead>
            {data.map((doc, index) => (
              <tbody key={index}>
                <tr onClick={() => handleClick(doc)}>
                  <td className="table-date">{doc.timestamp}</td>
                  <td className="table-text">{doc.categorie}</td>
                  <td className="table-price">{doc.expense}円</td>
                </tr>
              </tbody>
            ))}
          </table>
        </Grid>
        <Grid item className="item" lg={2}>
          <Post />
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item className="item" xs={7} sm={7} lg={4}>
          <Chart />
        </Grid>

        <Grid item className="item" xs={7} sm={7} lg={3}>
          <Pergraph />
        </Grid>
      </Grid>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="modal">
          <div className="chart-form">
            <h4>編集フォーム</h4>
            <form onSubmit={showSubmit}>
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>カテゴリー</th>
                    <th>金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        id="categorie"
                        name="categorie"
                        value={showCategorie}
                        onChange={handleCategorieChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id="expense"
                        name="expense"
                        value={showExpense}
                        onChange={handleValueChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="modal-button"
                type="submit"
                disabled={!showCategorie || !showExpense}
              >
                変更
              </button>
            </form>
            <span style={{ display: isNan ? "inline" : "none" }}>
              ＊数値を入力してください
            </span>
          </div>
          <button className="modal-change" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
