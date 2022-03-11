import React from 'react'
import Ticker from './components/Ticker';

import Oibr from './tickers/Oibr'
import Sapr from './tickers/Sapr';

export default function App() {
  
    const ruleSapr = (currentTicker: string, newQuantity: number, startQuantity: number) => {
        if (currentTicker === 'SAPR3') {
            return (startQuantity <= newQuantity );
        } else if (currentTicker === 'SAPR4') {
            return (startQuantity <= newQuantity - 20);
        } else {
            return false;
        }
    }
    const ruleOibr = (currentTicker: string, newQuantity: number, startQuantity: number) => {
        if (currentTicker === 'OIBR3') {
            return (startQuantity <= newQuantity - 20 );
        } else if (currentTicker === 'OIBR4') {
            return (startQuantity <= newQuantity - 30);
        } else {
            return false;
        }
    }
    const ruleTaee = (currentTicker: string, newQuantity: number, startQuantity: number) => {
            return (startQuantity <= newQuantity - 10 );
    }
    const ruleItub = (currentTicker: string, newQuantity: number, startQuantity: number) => {
        return (startQuantity <= newQuantity - 20 );
    }


  
    return (
    <>
        {/* <Oibr/>
        <div style={{border: "1px solid black", height: "2px", width: "auto", display: "block"}}></div> */}
        <Ticker tickerName='OIBR' rule={ruleOibr}  />
        <Ticker tickerName='SAPR' rule={ruleSapr}  />
        {/* <Ticker tickerName='TAEE' rule={ruleTaee}  />
        <Ticker tickerName='ITUB' rule={ruleItub}  /> */}
    </>
  )
}
