import React, { useEffect, useState } from "react";
import { INewTicker } from "../../shared/interfaces";
import { MdSave, MdArrowBack } from "react-icons/md";
import { addDoc, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import styles from "./styles.module.scss";
import { db } from "../../firebase-config";
import { useNavigate, useParams } from "react-router-dom";

const Ticker: React.FC = () => {
  const [ticker, setTicker] = useState<INewTicker>({} as INewTicker);
  const { id } = useParams<{ id: string }>();
  const tickerCollectionRef = collection(db, "ticker");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const getData = async () => {
        const tickerDoc = doc(db, "ticker", id);
        const docSnap = await getDoc(tickerDoc);
        setTicker({ ...(docSnap.data() as INewTicker), id });
      };
      getData();
    }
  }, [id]);

  const createTicker = async () => {
    await addDoc(tickerCollectionRef, ticker);
    alert("Dados salvos!");
  };

  const updateTicker = async () => {
    const tickerDoc = doc(db, "ticker", ticker.id);
    // const newField = {quantity : 3}
    await updateDoc(tickerDoc, { ...ticker });
    alert("Dados salvos!");
  };

  const save = () => {
    if (ticker.id) {
      updateTicker();
    } else {
      createTicker();
    }
  };

  return (
    <div className={styles.Container}>
      <div>
        <label htmlFor="name">Ticker</label>
        <input
          type="text"
          name="name"
          value={ticker.name}
          onChange={(e) => {
            setTicker((current) => ({ ...current, name: e.target.value }));
          }}
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantidade</label>
        <input
          type="number"
          name="quantity"
          value={ticker.quantity}
          onChange={(e) => {
            setTicker((current) => ({
              ...current,
              quantity: Number(e.target.value),
            }));
          }}
        />
      </div>
      <div>
        <label htmlFor="amount">Valor atual</label>
        <input
          type="number"
          name="amount"
          value={ticker.amount}
          onChange={(e) => {
            setTicker((current) => ({
              ...current,
              amount: Number(e.target.value),
            }));
          }}
        />
      </div>
      <div>
        <label htmlFor="startQuantity">Quantidade Original</label>
        <input
          type="number"
          name="startQuantity"
          value={ticker.startQuantity}
          onChange={(e) => {
            setTicker((current) => ({
              ...current,
              startQuantity: Number(e.target.value),
            }));
          }}
        />
      </div>
      <div>
        <label htmlFor="newQuantity">Depois da troca</label>
        <input
          type="number"
          name="newQuantity"
          value={ticker.newQuantity}
          onChange={(e) => {
            setTicker((current) => ({
              ...current,
              newQuantity: Number(e.target.value),
            }));
          }}
        />
      </div>
      <div className={styles.ToolBar}>
        <button onClick={() => save()}>
          <MdSave size={24} /> Salvar
        </button>
        <button onClick={() => navigate("/")}>
          <MdArrowBack size={24} /> Voltar
        </button>
      </div>
    </div>
  );
};

export default Ticker;
