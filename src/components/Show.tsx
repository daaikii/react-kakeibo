import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { useForm } from "react-hook-form";
import {
  DataContext,
  useSetShowId,
  useSetExpenses,
} from "../context/dataContext";

const Show: React.FC = () => {
  const showid = useContext(DataContext).showid;
  const setshowid = useSetShowId();
  const history = useHistory();
  const [update, setUpdate] = useState<boolean>(false);
  const expenses = useContext(DataContext).expenses;
  const setexpenses = useSetExpenses();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    expenses.forEach((expense, index) => {
      setValue(`categorie${index}`, expense.categorie);
      setValue(`expense${index}`, expense.expense);
    });
  });

  const onSubmit = (e: any) => {
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
      .doc(showid)
      .update({
        expenses: expenses.map((expense, index) => ({
          categorie: e[`categorie${index}`],
          expense: e[`expense${index}`],
        })),
        expense: sum,
        categorie: cat,
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
    setshowid("");
    history.push("/");
  };

  const handleDelete = () => {
    db.collection("posts")
      .doc(showid)
      .delete()
      .catch((error) => {
        alert(error);
      });
    history.push("/");
  };

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

  return (
    <>
      <div className="container">
        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-input">
              <h2 className="form-title">入力フォーム</h2>
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
                            {...register(`categorie${index}`, {
                              required: true,
                            })}
                          />
                        </td>
                        <td>
                          <input
                            {...register(`expense${index}`, {
                              valueAsNumber: true,
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
              <button className="form-button">保存</button>
            </div>
          </form>
          <div>
            <button className="form-change plus" onClick={addAddress}>
              +
            </button>
            <button className="form-change minus" onClick={removeAddress}>
              -
            </button>
          </div>
          <button className="form-change" onClick={handleDelete}>
            delete
          </button>
        </div>
      </div>
    </>
  );
};
export default Show;
