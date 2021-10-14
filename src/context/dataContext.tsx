import React, { useEffect, useState, useContext, createContext } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/userContext";

export type DATA = {
  id: string;
  expenses: { categorie: string; expense: string }[];
  categorie: string;
  expense: string;
  timestamp: any;
  uid: string;
}[];

export type DATACONTEXT = {
  data: {
    id: string;
    expenses: { categorie: string; expense: string }[];
    categorie: string;
    expense: string;
    timestamp: any;
    uid: string;
  }[];
  showid: string;
  perCategorie: string[];
  perSum: number[];
  chartCategorie: string[];
  chartSum: number[];
  expenses: { categorie: string; expense: string }[];
};

export const DataOpeContext = createContext({
  setshowid: (_: string) => console.log("Providerを指定してください"),
  setexpenses: (_: any) => console.log("Providerを指定してください"),
});
export const DataContext = createContext<DATACONTEXT>({
  data: [
    {
      id: "",
      expenses: [{ categorie: "", expense: "" }],
      categorie: "",
      expense: "",
      timestamp: "",
      uid: "",
    },
  ],
  showid: "",
  perCategorie: [],
  perSum: [],
  chartCategorie: [],
  chartSum: [],
  expenses: [{ categorie: "", expense: "" }],
});

const DataProvider: React.FC = ({ children }) => {
  const user = useContext(AuthContext);
  const [data, setData] = useState<DATA>([
    {
      id: "",
      expenses: [{ categorie: "", expense: "" }],
      categorie: "",
      expense: "",
      timestamp: "",
      uid: "",
    },
  ]);
  const [expenses, setExpenses] = useState([
    {
      categorie: "",
      expense: "",
    },
  ]);
  const [showid, setShowId] = useState("");
  const [perCategorie, setPerCategorie] = useState<string[]>([]);
  const [perSum, setPerSum] = useState<number[]>([]);
  const [chartCategorie, setChartCategorie] = useState<string[]>([]);
  const [chartSum, setChartSum] = useState<number[]>([]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        /*-------------------------<index用ののデータ生成>-----------------------*/

        const chartdata: any = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().uid === user.uid) {
            chartdata.push({
              id: doc.id,
              expenses: doc.data()?.expenses,
              categorie: doc.data().categorie,
              expense: doc.data().expense,
              timestamp: doc.data().timestamp,
              uid: doc.data().uid,
            });
          }
        });
        setData(chartdata);
        /*-------------------------</index用ののデータ生成>-----------------------*/

        /*-------------------------<円グラフのデータ生成>-----------------------*/
        const sums = new Map();
        snapshot.forEach((doc) => {
          if (doc.data().uid === user.uid) {
            const sort = doc.data().timestamp.match(/(\d+)\/(\d+)\/(\d+)$/);
            const cat = doc.data().categorie;
            const date = new Date();
            const thisMonth = date.getFullYear() + "/" + (date.getMonth() + 1);
            if (thisMonth === `${sort[1] + "/" + sort[2]}`) {
              //今日の日付
              if (doc.data().expenses) {
                //複数の場合の分岐
                doc.data().expenses.forEach((ex: any) => {
                  if (sums.get(ex.categorie)) {
                    //sumsにカテゴリーがあれば値を追加
                    const sum = sums.get(ex.categorie) + Number(ex.expense);
                    sums.set(ex.categorie, sum);
                  } else {
                    const add = Number(ex.expense);
                    sums.set(ex.categorie, add);
                  }
                });
              } else {
                //単体の場合の分岐
                if (sums.get(cat)) {
                  //sumsにカテゴリーがあれば値を追加
                  const sum = sums.get(cat) + Number(doc.data().expense);
                  sums.set(cat, sum);
                } else {
                  const add = Number(doc.data().expense);
                  sums.set(cat, add);
                }
              }
            }
            setPerCategorie(Array.from(sums.keys()));
            setPerSum(Array.from(sums.values()));
          }
        });
        /*-------------------------</円グラフのデータ生成>-----------------------*/
        /*-------------------------<棒グラフのデータ生成>-----------------------*/
        const sums0 = new Map();
        chartdata.forEach((doc: any) => {
          const sort = doc.timestamp.match(/(\d+)\/(\d+)\/(\d+)$/);
          const date = `${sort[1] + "/" + sort[2]}`;
          if (sums0.get(date)) {
            //sumsにカテゴリーがあれば値を追加
            const sum = sums0.get(date) + Number(doc.expense);
            sums0.set(date, sum);
          } else {
            const add = Number(doc.expense);
            sums0.set(date, add);
          }
          const arrkey = Array.from(sums0.keys());
          arrkey.reverse();
          setChartCategorie(arrkey);
          const arrval = Array.from(sums0.values());
          arrval.reverse();
          setChartSum(arrval);
        });
        /*-------------------------</棒グラフのデータ生成>-----------------------*/
      });
  }, [user.uid]);
  const setshowid = (id: string) => {
    setShowId(id);
    data.forEach((doc) => {
      doc.id === id && setExpenses(doc.expenses);
    });
  };
  const setexpenses = (data: any) => setExpenses(data);

  return (
    <DataOpeContext.Provider value={{ setshowid, setexpenses }}>
      <DataContext.Provider
        value={{
          data,
          showid,
          perCategorie,
          perSum,
          chartCategorie,
          chartSum,
          expenses,
        }}
      >
        {children}
      </DataContext.Provider>
    </DataOpeContext.Provider>
  );
};

export const useSetShowId = () => useContext(DataOpeContext).setshowid;
export const useSetExpenses = () => useContext(DataOpeContext).setexpenses;

export default DataProvider;
