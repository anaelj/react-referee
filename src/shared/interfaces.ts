export interface ITicker {
  ask: number;
  bid: number;
  time: Date;
  tick_size: number;
  tick_value: number;
  contract_size: number;
  min_volume: number;
  max_volume: number;
  volume_step: number;
  name?: string;
}

export interface INewTicker {
  id: string;
  name: string;
  amount: number;
  newQuantity: number;
  quantity: number;
  startQuantity: number;
}
