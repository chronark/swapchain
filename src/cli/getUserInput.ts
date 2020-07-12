import inquirer from "inquirer"
import commander from "commander"
import fs from "fs"
import { getSecret } from "../pkg/secret/secret"
import { isValidBitcoinPrivateKey, isValidBitsharesPrivateKey, isValidBitcoinPublicKey } from "../pkg/address/validator"
import { ACCSFields } from "../accs/accs"

/**
 * Get user input from JSON config file or stdin and store everything in a fields object.
 *
 * @returns The raw user input fields object.
 */
export async function getUserInput(): Promise<ACCSFields> {
  const program = commander.program
    .description(
      "An application for performing ACCS (atomic cross chain swaps) via HTLCs (hash time-locked contracts).",
    )
    .option("-i, --interactive", "run swapchain CLI interactively")
    .option("-f, --file <path>", "run swapchain CLI with config file at <path>")
    .parse(process.argv)

  let fields = {} as ACCSFields

  if (program.file) {
    const rawFile = fs.readFileSync(program.file)

    try {
      fields = JSON.parse(Buffer.from(rawFile).toString())
    } catch {
      errorHandler("Invalid JSON config file.")
    }

    if (!("mode" in fields) || (fields.mode !== "proposer" && fields.mode !== "accepter")) {
      errorHandler("Invalid mode. Choose proposer or accepter")
    } else if (
      !("networkToTrade" in fields) ||
      (fields.networkToTrade !== "mainnet" && fields.networkToTrade !== "testnet")
    ) {
      errorHandler("Invalid network. Choose mainnet or testnet.")
    } else if (!("currencyToGive" in fields) || (fields.currencyToGive !== "BTC" && fields.currencyToGive !== "BTS")) {
      errorHandler("Invalid currency to give. Choose BTC or BTS.")
    } else if (!("priority" in fields) || ![0, 1, 2].includes(fields.priority)) {
      errorHandler("Invalid priority. Must be 0, 1 or 2.")
    } else if (
      !("bitcoinPrivateKey" in fields) ||
      !isValidBitcoinPrivateKey(fields.bitcoinPrivateKey, fields.networkToTrade)
    ) {
      errorHandler("Invalid Bitcoin private key.")
    } else if (!("bitsharesPrivateKey" in fields) || !isValidBitsharesPrivateKey(fields.bitsharesPrivateKey)) {
      errorHandler("Invalid Bitshares private key.")
    } else if (
      !("counterpartyBitcoinPublicKey" in fields) ||
      !isValidBitcoinPublicKey(fields.counterpartyBitcoinPublicKey)
    ) {
      errorHandler("Invalid Bitcoin public key.")
    } else if (!("counterpartyBitsharesAccountName" in fields)) {
      errorHandler("Invalid Bitshares account name.")
    } else if (!("rate" in fields) || typeof fields.rate !== "number") {
      errorHandler("Invalid exchange rate.")
    } else if (!("amountToSend" in fields) || typeof fields.amountToSend !== "number") {
      errorHandler("Invalid amount to send.")
    } else if ("amountToReceive" in fields && typeof fields.amountToReceive !== "number") {
      errorHandler("Invalid amount to receive.")
    } else if (fields.mode === "accepter" && (!("secretHash" in fields) || fields.secretHash!.length !== 64)) {
      errorHandler("Invalid secret hash.")
    } else if (fields.currencyToGive === "BTC" && (!("bitcoinTxID" in fields) || fields.bitcoinTxID.length !== 64)) {
      errorHandler("Invalid Bitcoin Transaction ID")
    }
  } else {
    const questions: inquirer.QuestionCollection = [
      {
        type: "rawlist",
        name: "mode",
        message: "Are you proposer or accepter?",
        choices: ["proposer", "accepter"],
      },
      {
        type: "rawlist",
        name: "networkToTrade",
        message: "On what network do you want to trade?",
        choices: ["mainnet", "testnet"],
      },
      {
        type: "rawlist",
        name: "currencyToGive",
        message: "Would you like to give BTC or BTS?",
        choices: ["BTC", "BTS"],
      },
      {
        type: "rawlist",
        name: "priority",
        message: "Please enter the priority of the Bitcoin transactions:",
        choices: [
          {
            key: "0",
            name: "High",
            value: "0",
          },
          {
            key: "1",
            name: "Medium",
            value: "1",
          },
          {
            key: "2",
            name: "Low",
            value: "2",
          },
        ],
      },
      {
        type: "input",
        name: "bitcoinPrivateKey",
        message: "Please enter your Bitcoin private key (WIF format):",
        validate: (value: string, answers: inquirer.Answers) => {
          return isValidBitcoinPrivateKey(value, answers.networkToTrade) || "Invalid Bitcoin private key. Try again."
        },
      },
      {
        type: "input",
        name: "bitsharesPrivateKey",
        message: "Please enter your Bitshares private key (WIF format):",
        validate: (value: string) => {
          return isValidBitsharesPrivateKey(value) || "Invalid Bitshares private key. Try again."
        },
      },
      {
        type: "input",
        name: "counterpartyBitcoinPublicKey",
        message: "Please enter the Bitcoin public key of the counterparty:",
        validate: (value: string) => {
          return isValidBitcoinPublicKey(value) || "Invalid Bitcoin public key. Try again."
        },
      },
      {
        type: "input",
        name: "counterpartyBitsharesAccountName",
        message: "Please enter the Bitshares account name of the counterparty:",
      },
      {
        type: "input",
        name: "amountToSend",
        message: "Please enter the amount of BTC you want to give:",
        when: (answers: inquirer.Answers) => {
          return answers.currencyToGive === "BTC"
        },
        filter: (value: string) => {
          return Number(value)
        },
      },
      {
        type: "input",
        name: "amountToSend",
        message: "Please enter the amount of BTS you want to give:",
        when: (answers: inquirer.Answers) => {
          return answers.currencyToGive === "BTS"
        },
        filter: (value: string) => {
          return Number(value)
        },
      },
      {
        type: "input",
        name: "rate",
        message: "Please enter the exchange rate in BTS/BTC:",
        filter: (value: string) => {
          return Number(value)
        },
      },
      {
        type: "input",
        name: "secretHash",
        message: "Please enter the secret hash you received from the proposer:",
        validate: (value: string) => {
          return value.length === 64 || "Invalid secret hash. Try again."
        },
        when: (answers: inquirer.Answers) => {
          return answers.mode === "accepter"
        },
      },
      {
        type: "input",
        name: "bitcoinTxID",
        message: "Please enter the Bitcoin p2wpkh address' transaction ID which should be spent:",
        validate: (value: string) => {
          return value.length === 64 || "Invalid Bitcoin Transaction ID. Try again."
        },
        when: (answers: inquirer.Answers) => {
          return answers.currencyToGive === "BTC"
        },
      },
    ]

    fields = (await inquirer.prompt(questions)) as ACCSFields
  }

  if (!("amountToReceive" in fields!)) {
    if (fields.currencyToGive === "BTC") {
      fields.amountToReceive = fields.amountToSend * fields.rate
    } else {
      fields.amountToReceive = fields.amountToSend / fields.rate
    }
  }

  if (fields.mode === "proposer") {
    fields.secret = getSecret()
    console.log(
      `\u001b[32m!\u001b[37;1m Please pass this secret hash to the counterparty: -> \u001b[33m${fields.secret.hash.toString(
        "hex",
      )}\u001b[37;1m <-\u001b[0m`,
    )
  } else {
    fields.secret = {
      preimage: undefined,
      hash: Buffer.from(fields.secretHash!, "hex"),
    }
  }

  return fields
}

/**
 * An errorhandler for errors in CLI.
 *
 * @param message - The message to print.
 */
function errorHandler(message: string): void {
  console.error(message)
  process.exit(1)
}
