import { useEffect, useState } from "react";
import { api } from "./../services/api";
import { ITicker } from "./../shared/interfaces";
import useSound from "use-sound";
import soundUrl from "./../shared/alerta.mp3";
import { MdAssessment, MdCached } from "react-icons/md";
import styles from "./styles.module.scss";

interface IPairOfTicker {
  tickerA: ITicker;
  tickerB: ITicker;
}

interface IUserData {
  ticker: string;
  quantity: number;
  amount: number;
  quantityChangeStart: number;
  quantityChangeNew: number;
}

interface ITickerProps {
  tickerName: string;
  rule: (
    currentTicker: string,
    newQuantity: number,
    startQuantity: number
  ) => boolean;
}

function Ticker({ tickerName, rule }: ITickerProps) {
  const [timeVerify, setTimeVerify] = useState(0);
  const oneMinute = 60000;
  const intervalToVerify = oneMinute;
  const [ticketList, setTicketList] = useState<IPairOfTicker[]>([
    {} as IPairOfTicker,
  ]);
  const [loading, setLoading] = useState(false);
  const [lastVerify, setLastVerify] = useState(new Date());
  const [alertToTrade, setAlertToTrade] = useState(false);
  const [diffHistoric, setDiffHistoric] = useState<string[]>([]);
  const [showHistoric, setShowHistoric] = useState(false);

  const getDataFromStore = () => {
    const saved = localStorage.getItem("userData" + tickerName);
    if (saved) {
      return JSON.parse(saved);
    } else {
      return {
        ticker: `${tickerName}3`,
        quantity: 0,
        amount: 0,
        quantityChangeStart: 0,
        quantityChangeNew: 0,
      };
    }
  };

  const [userData, setUserData] = useState<IUserData>(
    getDataFromStore() as IUserData
  );

  const handleGetData = async (tickerAA: String, tickerBB: string) => {
    const currentTicketListFiltered = ticketList.filter((item) => {
      item?.tickerA?.name !== tickerAA;
    });
    setLoading(true);
    api.get(`/symbols/${tickerAA}`).then(({ data: dataTickerA }) => {
      api.get(`/symbols/${tickerBB}`).then(({ data: dataTickerB }) => {
        const newTicketList = [
          ...currentTicketListFiltered,
          {
            tickerA: { ...dataTickerA, name: tickerAA },
            tickerB: { ...dataTickerB, name: tickerBB },
          },
        ];
        setTicketList(newTicketList);
        setLoading(false);
        const now = new Date();
        setLastVerify(now);
      });
    });
  };

  const resetQuantityChangeStart = () => {
    if (userData.amount && userData.ticker) {
      const newValue =
        userData?.amount /
        (userData?.ticker?.toUpperCase() === `${tickerName}3`
          ? ticketList[0].tickerB?.bid
          : ticketList[0].tickerA?.bid);
      setUserData({
        ...userData,
        quantityChangeStart: Math.floor(newValue),
      });
    }
  };

  useEffect(() => {
    const newAmount = Math.floor(
      userData?.ticker?.toUpperCase() === `${tickerName}3`
        ? ticketList[0].tickerA?.bid * userData?.quantity
        : ticketList[0].tickerB?.bid * userData?.quantity
    );

    const newValue =
      newAmount /
      (userData?.ticker?.toUpperCase() === `${tickerName}3`
        ? ticketList[0].tickerB?.ask
        : ticketList[0].tickerA?.ask);

    setUserData({
      ...userData,
      amount: newAmount,
      quantityChangeNew: Math.floor(newValue),
    });
  }, [ticketList]);

  useEffect(() => {
    localStorage.setItem("userData" + tickerName, JSON.stringify(userData));
    const goTrade = rule(
      userData?.ticker?.toUpperCase(),
      userData.quantityChangeNew,
      userData.quantityChangeStart
    );
    setAlertToTrade(goTrade);
    if (goTrade) {
      play();
    }

    setDiffHistoric([
      ...diffHistoric,
      (userData.quantityChangeNew - userData.quantityChangeStart).toString() +
        " - " +
        lastVerify,
    ]);
  }, [userData]);

  useEffect(() => {
    handleGetData(`${tickerName}3`, `${tickerName}4`);
    setTimeout(() => {
      setTimeVerify((state) => (state === 0 ? 1 : 0));
    }, intervalToVerify);
  }, [timeVerify]);

  const [play, { stop }] = useSound(soundUrl, {
    playbackRate: 1,
    volume: 0.1,
  });
  
  useEffect(() => {
    console.log(showHistoric);
  }, [showHistoric]);
  
  return (
    <div className={styles.container}>
      <div>{`${tickerName}3 - ask:${ticketList[0]?.tickerA?.ask}   bid:${ticketList[0]?.tickerA?.bid}`}</div>
      <div>{`${tickerName}4 - ask:${ticketList[0]?.tickerB?.ask}   bid:${ticketList[0]?.tickerB?.bid}`}</div>
      {/* <div>{`Ultima verificação: ${lastVerify}`}</div> */}
      <span style={{ display: "block", height: "9px" }}></span>

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="ticker">Papel</label>
          <input
            type="text"
            name="ticker"
            value={userData?.ticker}
            style={{ width: "60px" }}
            onChange={(e) =>
              setUserData({ ...userData, ticker: e.target.value })
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="quantity">Qtde Atual</label>
          <input
            type="text"
            name="quantity"
            style={{ width: "70px" }}
            value={userData?.quantity}
            onChange={(e) =>
              setUserData({ ...userData, quantity: Number(e.target.value) })
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="amount">Valor Total</label>
          <input
            type="text"
            name="amount"
            value={userData?.amount}
            style={{ width: "70px" }}
            onChange={(e) =>
              setUserData({ ...userData, amount: Number(e.target.value) })
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Parâmetro de troca</label>
          <input
            type="text"
            name="quantityChangeStart"
            value={userData?.quantityChangeStart}
            style={{ width: "80px" }}
            onChange={(e) =>
              setUserData({
                ...userData,
                quantityChangeStart: Number(e.target.value),
              })
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Após Troca</label>
          <input
            type="text"
            name="quantityChangeNew"
            style={{ width: "80px" }}
            value={userData?.quantityChangeNew}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ display: "block", height: "19px" }}></span>
          <button onClick={resetQuantityChangeStart} className={styles.button}>
            <MdCached size={24}/>
            Reiniciar Parâmetro de Troca
          </button>
          {/* <button onClick={() => play()}>testar som</button>
          <button onClick={() => stop()}>pausar som</button> */}
        </div>
        <div>
          <span style={{ display: "block", height: "19px" }}></span>
          <button onClick={() => setShowHistoric(!showHistoric)} className={styles.button}>
            <MdAssessment size={24}/>
            Histórico
          </button>
        </div>
      </div>
      {alertToTrade && (
        <div style={{ background: "red", height: "45px" }}></div>
      )}
      {loading && <div style={{ background: "green", height: "45px" }}></div>}
      {showHistoric && (
        <div className={styles.historic}>
          {diffHistoric
            .slice(0)
            .reverse()
            .map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Ticker;
