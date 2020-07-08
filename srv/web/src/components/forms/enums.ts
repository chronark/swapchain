export enum State {
  IDLE,
  RUNNING,
  SUCCESS,
  ERROR,
  FAILURE,
}

export enum Currency {
  BTC = "BTC",
  BTS = "BTS",
}

export enum Network {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

export enum Timelock {
  LONG = 20,
  MEDIUM = 13,
  SHORT = 6,
}

export enum Priority {
  HIGH,
  MEDIUM,
  LOW,
}
