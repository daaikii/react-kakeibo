import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { AuthContext } from "../context/userContext";
import { DataContext, useSetExpenses } from "../context/dataContext";
import { useForm } from "react-hook-form";

const Posts: React.FC = () => {
  const history = useHistory();
  const [update, setUpdate] = useState<boolean>(false);
  const user = useContext(AuthContext);
  const expenses = useContext(DataContext).expenses;
  const setexpenses = useSetExpenses();
  const { register, handleSubmit } = useForm();

  const addAddress = () => {
    const ec = expenses.slice();
    ec.push({ categorie: "", expense: "" });
    setexpenses(ec);
  };

  const removeAddress = () => {
    const ec = expenses.slice();
    ec.pop();
    setexpenses(ec);
    setUpdate(update ? false : true);
  };

  const onSubmit = (e: any) => {
    const newdate = new Date();
    const timestamp =
      newdate.getFullYear() +
      "/" +
      (newdate.getMonth() + 1) +
      "/" +
      newdate.getDate();
    let sum = 0;
    let cat = "";
    expenses.forEach((doc, index) => {
      sum = sum + Number(e[`expense${index}`]);
      if (cat === "") {
        cat = e[`categorie${index}`];
      } else {
        cat = cat + "/" + e[`categorie${index}`];
      }
    });
    db.collection("posts")
      .add({
        expenses: expenses.map((expense, index) => ({
          categorie: e[`categorie${index}`],
          expense: e[`expense${index}`],
        })),
        expense: sum,
        categorie: cat,
        timestamp: timestamp,
        uid: user.uid,
      })
      .catch((error) => {
        alert(error);
      });
    setexpenses([
      {
        categorie: "",
        expense: "",
      },
    ]);
    history.push("/");
  };

  useEffect(() => {
    setexpenses([
      {
        categorie: "",
        expense: "",
      },
    ]);
  }, [setexpenses]);

  return (
    <div className="container">
      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="form-title">入力フォーム</h2>
          <div className="form-input">
            <table className="form-table">
              <thead>
                <tr>
                  <th>カテゴリー</th>
                  <th>金額</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense: any, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          {...register(`categorie${index}`, { required: true })}
                        />
                      </td>
                      <td>
                        <input
                          {...register(`expense${index}`, {
                            required: true,
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "整数で入力してください",
                            },
                          })}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button className="form-button">保存</button>
        </form>
        <div>
          <button className="form-change plus" onClick={addAddress}>
            +
          </button>
          <button className="form-change minus" onClick={removeAddress}>
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
