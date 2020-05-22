from pprint import pprint
from bitshares import BitShares
from bitshares.amount import Amount
from secret import get_secret

# Connect to testnet
bitshares = BitShares("wss://testnet.dex.trading/")

# Unlock wallet
bitshares.wallet.unlock("supersecret")

# Create HTLC and print return object
pprint(bitshares.htlc_create(amount=Amount({"amount": 1, "asset": "BTS"}), to="init2", preimage=get_secret(32), hash_type='sha256', account="amos", expiration=30))