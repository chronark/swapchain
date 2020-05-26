const bitsharesjs_ws_1 = require("bitsharesjs-ws");
const bitsharesjs_1 = require("bitsharesjs");
const { btsTransfer } = require("../dist/tmp/transfer");
const { btsCreateHtlc } = require("../dist/tmp/htlc")

const privKey = "5K75Ve18ttnu7Ymd1nnCMsnGkfZz4KQnsfFrYEz7Cmw39FNEALN";
const pKey = bitsharesjs_1.PrivateKey.fromWif(privKey);

// btsTransfer("amos", "init0", "1", "TEST", pKey, "wss://testnet.dex.trading")
btsCreateHtlc("amos", "init0", 1, "TEST", 30, pKey, "wss://testnet.dex.trading")