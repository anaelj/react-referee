import React, { useEffect, useState } from "react";
import Ticker from "../../components/Ticker";
import { useNavigate } from "react-router-dom";
import { MdOpenInNew } from "react-icons/md";

import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { INewTicker } from "../../shared/interfaces";

export function Referee() {
  const [tickers, setTickers] = useState<INewTicker[]>([]);
  const navigate = useNavigate();
  const tickerCollectionRef = collection(db, "ticker");

  useEffect(() => {
    const getTickers = async () => {
      const data = await getDocs(tickerCollectionRef);
      setTickers(
        data.docs.map((doc) => ({ ...(doc.data() as INewTicker), id: doc.id }))
      );
    };
    getTickers();
  }, []);

  const getRule = (
    currentTicker: string,
    newQuantity: number,
    startQuantity: number
  ) => {
    if (currentTicker === "OIBR3") {
      return startQuantity <= newQuantity - 20;
    } else if (currentTicker === "OIBR4") {
      return startQuantity <= newQuantity - 30;
    } else if (currentTicker === "SAPR3") {
      return startQuantity <= newQuantity;
    } else if (currentTicker === "SAPR4") {
      return startQuantity <= newQuantity - 20;
    } else if (currentTicker === "ITSA3") {
      return startQuantity <= newQuantity - 1;
    } else if (currentTicker === "ITSA4") {
      return startQuantity <= newQuantity - 2;
    } else {
      return false;
    }
  };

  return (
    <>
      <div style={{ margin: "16px" }}>
        <button onClick={() => navigate(`newticker`)}>
          <MdOpenInNew />
          Novo
        </button>
      </div>
      {tickers.map((ticker) => {
        return <Ticker rule={getRule} ticker={ticker} />;
      })}
    </>
  );
}
