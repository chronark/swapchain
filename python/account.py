from bitshares import BitShares
from bitshares.account import Account

# Access data for account "amos" on Testnet
account = Account('amos', blockchain_instance=BitShares("wss://testnet.dex.trading/"))

print(account.balances[0])