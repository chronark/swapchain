"use strict";
exports.__esModule = true;
var crypto_js_1 = require("crypto-js");
var crypto_random_string_1 = require("crypto-random-string");
/**
 * A function for hashing a crypto random string.
 *
 * @param length The length of the requested secret
 * @returns An Secret interface with a secret/hash pair
 *
 */
function getSecret(length) {
    var secret = crypto_random_string_1["default"]({ length: length, type: "base64" });
    var hash = crypto_js_1.SHA256(secret).toString();
    return {
        secret: secret,
        hash: hash
    };
}
exports.getSecret = getSecret;
