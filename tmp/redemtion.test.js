/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
const bitsharesjs_ws_1 = require("bitsharesjs-ws")
const bitsharesjs_1 = require("bitsharesjs")
const { btsTransfer } = require("../dist/tmp/transfer")
const { btsCreateHtlc } = require("../dist/tmp/htlc")
const { btsRedeemHtlc } = require("./redemption")

const privKey = "5K75Ve18ttnu7Ymd1nnCMsnGkfZz4KQnsfFrYEz7Cmw39FNEALN" // ändert sich mit dem zweiten Testtoken (sind jetzt noch die Daten vom SenderAccount)
const pKey = bitsharesjs_1.PrivateKey.fromWif(privKey) // ändert sich mit dem zweiten Testtoken (sind jetzt noch die Daten vom SenderAccount)
const htlcObject = htlc_id // hier müssten wir dann die htlc_id noch irgendwie hinkriegen. Mit get_htlc?

// To compare: btsCreateHtlc("amos", "init0", 1, "TEST", 30, pKey, "wss://testnet.dex.trading")
btsRedeemHtlc("receiver", pKey, "wss://testnet.dex.trading", htlcObject)
