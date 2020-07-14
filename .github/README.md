<div align="center">
    <img
        width="200%"
        src="https://raw.githubusercontent.com/chronark/swapchain/master/.github/Logo_Swapchain_Bold_Wide.svg?sanitized=true">
    </img>
    <a 
        href="https://github.com/chronark/swapchain/blob/master/LICENSE">
        <img 
            src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square">
        </img>
    </a>
    <a 
        href="https://github.com/chronark/swapchain/actions">
        <img 
            src="https://github.com/chronark/swapchain/workflows/CI/badge.svg?branch=master">
        </img>
    </a>
</div>

> Swapchain is an application for performing ACCS (atomic cross chain swaps) via HTLCs (hash-time-locked contracts).

## Supported cryptocurrencies

|           | mainnet                  | testnet            |
| --------- | ------------------------ | ------------------ |
| Bitcoin   | :heavy_multiplication_x: | :heavy_check_mark: |
| Bitshares | :heavy_multiplication_x: | :heavy_check_mark: |

Mainnet is not tested yet but is expected to work.

## Installation

### Setup

```bash
git clone https://github.com/chronark/swapchain.git

cd swapchain

npm install

npm run build
```

### CLI

Command-line tool to swap cryptocurrencies with a known counterparty.

```bash
node dist/srv/accs/index.js testnet // Either testnet or mainnet
```

Or use the npm script:

```bash
npm run cli -- testnet
```

## Documentation

You can see the stable and development versions here:

- [stable](https://swapchain.netlify.app)
- [dev](https://swapchain-dev.netlify.app)

## Development setup

Please see our [contribution guidelines](https://github.com/chronark/swapchain/blob/master/.github/CONTRIBUTING.md)

## License

This project is [MIT](https://github.com/chronark/swapchain/blob/master/LICENSE) licensed.
