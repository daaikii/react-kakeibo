import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { DataContext } from "../context/dataContext";

const Chart: React.FC = () => {
  const categorie = useContext(DataContext).chartCategorie;
  const sum = useContext(DataContext).chartSum;

  const graphData = {
    labels: categorie,
    datasets: [
      {
        backgroundColor: "#1e90ff",
        data: sum,
        label: "月別出費額",
      },
    ],
  };
  return <Bar data={graphData} />;
};

export default Chart;
