export interface FlashTradeParams {
  token: string;
  side: "long" | "short";
  collateralUsd: number;
  leverage: number;
}

export interface FlashCloseTradeParams {
  token: string;
  side: "long" | "short";
}
