import React from "react"
import { ReactComponent as LightBulb } from "../../icons/light-bulb.svg"
import { Network } from "../util/enums"

interface Props {
  network: Network
}

export const Protip = (props: Props) => {
  return (
    <div className="flex flex-col items-center px-3 py-2 space-x-1 md:flex-row">
      <div className="flex items-center">
        <LightBulb className="h-6 text-gray-600"></LightBulb>
        <span className="font-semibold text-gray-900">ProTip!</span>
      </div>
      <div className="flex flex-col items-center md:flex-row">
        <span className="text-center text-gray-700">Check your transaction on the blockchain:</span>
        <div className="flex px-2 space-x-2">
          <a
            target="blank"
            className="text-blue-400"
            href={props.network === Network.MAINNET ? "https://blockstream.info/" : "https://blockstream.info/testnet/"}
          >
            Bitcoin
          </a>
          <a target="blank" className="text-blue-400" href="https://wallet.bitshares.org/#/">
            Bitshares
          </a>
        </div>
      </div>
    </div>
  )
}
