import { askUser } from "./util"
import { getSecret } from "../web/src/pkg/secret/secret"
import {
  isValidBitcoinPrivateKey,
  isValidBitsharesPrivateKey,
  isValidBitcoinPublicKey,
} from "../web/src/pkg/address/validator"
import { Timelock } from "../web/src/components/forms/enums"
import { ACCSFields } from "../web/src/accs/accs"
import readline from "readline"

/**
 * Get user input from stdin and store everything in a fields object.
 *
 * @returns The raw user input fields object.
 */
export async function getUserInput(read: readline.Interface): Promise<ACCSFields> {
  const fields = {} as ACCSFields

  fields.mode = (await askUser(read, "Are you proposer or accepter? (proposer/accepter): ")).toLowerCase()
  if (fields.mode !== "proposer" && fields.mode !== "accepter") {
    throw new Error("Invalid mode. Choose proposer or accepter")
  }

  fields.networkToTrade = (
    await askUser(read, "On what network do you want to trade? (mainnet/testnet): ")
  ).toLowerCase()
  if (fields.networkToTrade !== "mainnet" && fields.networkToTrade !== "testnet") {
    throw new Error("Invalid network. Choose mainnet or testnet.")
  }

  fields.currencyToGive = await askUser(read, "Would you like to give BTC or BTS? (BTC/BTS): ")
  if (fields.currencyToGive !== "BTC" && fields.currencyToGive !== "BTS") {
    throw new Error("Invalid type. Choose BTC or BTS.")
  }
  const txTypeName = fields.currencyToGive === "BTC" ? "BTS/BTC" : "BTC/BTS"

  const priority = await askUser(
    read,
    "Please enter the priority of the Bitcoin transactions (0 = high, 1 = medium, 2 = low): ",
  )
  if (!["0", "1", "2"].includes(priority)) {
    throw new Error("Invalid priority. Must be 0, 1 or 2.")
  }

  fields.priority = Number(priority)

  fields.bitcoinPrivateKey = await askUser(read, "Please enter your Bitcoin private key (WIF format): ")
  if (!isValidBitcoinPrivateKey(fields.bitcoinPrivateKey, fields.networkToTrade)) {
    throw new Error("Invalid Bitcoin private key.")
  }

  fields.bitsharesPrivateKey = await askUser(read, "Please enter your Bitshares private key (WIF format): ")
  if (!isValidBitsharesPrivateKey(fields.bitsharesPrivateKey)) {
    throw new Error("Invalid Bitshares private key.")
  }

  fields.counterpartyBitcoinPublicKey = await askUser(read, "Please enter the Bitcoin public key of the counterparty: ")
  if (!isValidBitcoinPublicKey(fields.counterpartyBitcoinPublicKey)) {
    throw new Error("Invalid Bitcoin public key.")
  }

  fields.counterpartyBitsharesAccountName = await askUser(
    read,
    "Please enter the Bitshares account name of the counterparty: ",
  )

  const amount = await askUser(read, `Please enter the amount of ${txTypeName.slice(-3)} you want to exchange: `)

  const exchangeRate = await askUser(read, "Please enter the exchange rate in BTS/BTC: ")

  fields.rate = parseFloat(exchangeRate)

  if (fields.currencyToGive === "BTC") {
    fields.amountToSend = parseFloat(amount)
    fields.amountToReceive = fields.amountToSend * fields.rate
  } else {
    fields.amountToSend = parseFloat(amount)
    fields.amountToReceive = fields.amountToSend / fields.rate
  }

  console.log(
    `You will get ${fields.amountToReceive} ${txTypeName.substring(0, 3)} for giving ${
      fields.amountToSend
    } ${txTypeName.slice(-3)}.`,
  )

  let timelock: string

  if (fields.mode === "proposer") {
    timelock = await askUser(read, "Please enter the duration of the timelock (0 = long, 1 = medium, 2 = short): ")

    if (!["0", "1", "2"].includes(timelock)) {
      throw new Error("Invalid timelock. Must be 0, 1 or 2.")
    }

    fields.secret = getSecret()
    console.log(`Please pass this secret hash to the counterparty: ${fields.secret.hash.toString("hex")}`)
  } else {
    // Get timelock duration
    timelock = await askUser(read, "Please enter the duration of the timelock you received from the proposer: ")

    if (!["0", "1", "2"].includes(timelock)) {
      throw new Error("Invalid timelock. Must be 0, 1 or 2.")
    }

    // Get secret hash
    const hashString = await askUser(read, "Please enter the secret hash you received from the proposer: ")
    // SHA256 hash length must be 64
    if (hashString.length !== 64) {
      throw new Error("Invalid secret hash length.")
    }
    fields.secret = {
      preimage: undefined,
      hash: Buffer.from(hashString, "hex"),
    }
  }

  if (fields.currencyToGive === "BTC") {
    fields.bitcoinTxID = await askUser(
      read,
      "Please enter the Bitcoin p2wpkh address' transaction ID which should be spent: ",
    )
    // TODO: Validate txid
    // TODO: Errorhandling for missing transaction (now: getWitnessUtxo fails with "length of undefined")
  }

  switch (timelock) {
    case "0":
      fields.timelock = Timelock.LONG
      break
    case "1":
      fields.timelock = Timelock.MEDIUM
      break
    default:
      fields.timelock = Timelock.SHORT
  }

  return fields
}
