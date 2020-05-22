from pprint import pprint
from bitshares import BitShares

# Connect to testnet
bitshares = BitShares("wss://testnet.dex.trading/")

# Unlock wallet
bitshares.wallet.unlock("supersecret")

# Create deposit and print return object
pprint(bitshares.transfer("init2", "1", "TEST", account="amos"))