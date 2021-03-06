import { useEffect, useState } from "react";
import { api } from "./../services/api";
import { ITicker } from "./../shared/interfaces";
// import useSound from "use-sound";
import soundUrl from "./../shared/alerta.mp3";

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

function Sapr({ tickerName, rule }: ITickerProps) {
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
    const newAmount =
      userData?.ticker?.toUpperCase() === `${tickerName}3`
        ? ticketList[0].tickerA?.bid * userData?.quantity
        : ticketList[0].tickerB?.bid * userData?.quantity;

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
    // userData.quantityChangeNew > userData.quantityChangeStart;
    setAlertToTrade(goTrade);
    // if (goTrade) {
    //   play();
    // }

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

  // const [play, { stop }] = useSound(soundUrl, {
  //   playbackRate: 1,
  //   volume: 0.1,
  // });

  return (
    <>
      <div>{`${tickerName}3 - ask:${ticketList[0]?.tickerA?.ask}   bid:${ticketList[0]?.tickerA?.bid}`}</div>
      <div>{`${tickerName}4 - ask:${ticketList[0]?.tickerB?.ask}   bid:${ticketList[0]?.tickerB?.bid}`}</div>
      <div>{`Ultima verifica????o: ${lastVerify}`}</div>

      <div style={{ display: "flex", gap: "5px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="ticker">Papel</label>
          <input
            type="text"
            name="ticker"
            value={userData?.ticker}
            onChange={(e) =>
              setUserData({ ...userData, ticker: e.target.value })
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="quantity">Quantidade Atual</label>
          <input
            type="text"
            name="quantity"
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
            onChange={(e) =>
              setUserData({ ...userData, amount: Number(e.target.value) })
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Par??metro de troca</label>
          <input
            type="text"
            name="quantityChangeStart"
            value={userData?.quantityChangeStart}
            onChange={(e) =>
              setUserData({
                ...userData,
                quantityChangeStart: Number(e.target.value),
              })
            }
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Ap??s Troca</label>
          <input
            type="text"
            name="quantityChangeNew"
            value={userData?.quantityChangeNew}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ display: "block", height: "19px" }}></span>
          <button onClick={resetQuantityChangeStart}>
            Reiniciar Par??metro de Troca
          </button>
          {/* <button onClick={() => play()}>testar som</button> */}
          <button onClick={() => stop()}>pausar som</button>
        </div>
      </div>
      {alertToTrade && (
        <div style={{ background: "red", height: "45px" }}></div>
      )}
      {loading && <div style={{ background: "green", height: "45px" }}></div>}
      <div style={{ background: "gray" }}>
        {diffHistoric
          .slice(0)
          .reverse()
          .map((item) => (
            <div>{item}</div>
          ))}
      </div>
    </>
  );
}

export default Sapr;
