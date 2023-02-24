import React, { useEffect, useState } from "react";
import "./index.css";
import { Layout, Table } from "antd";
import InputForm from "./components/Input";
import MyTable, { Artist } from "./components/MyTable";
import axios from "axios";

const App: React.FC = () => {
  const [data, setData] = useState<Artist[]>([]);
  useEffect(() => {
    axios
      .get("https://rebel-test.azurewebsites.net/api/Artist")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);
  const OnNewValue = (artist: Artist) => {
    let _data = data;
    _data?.push(artist);
    setData((_data) => [..._data, artist]);
  };
  return (
    <Layout style={{ margin: 20, flexDirection: "row" }}>
      <InputForm onNewValue={OnNewValue} />
      <MyTable data={data} />
    </Layout>
  );
};

export default App;
