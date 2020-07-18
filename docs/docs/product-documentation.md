---
id: product-documentation
title: Swapchain Product Documentation
sidebar_label: Swapchain Product Documentation
---

## 1. Introduction

This document provides information regarding the product of Swapchain from the project course AMOS at Friedrich-Alexander-University Erlangen-Nuremberg. Atomic cross-chain swaps between Bitcoin and Bitshares are at Swapchain's core. This product documentation serves as guideline for potential business users who have observed a similar use case within their respective organization.

### 1.1. Notes:

The following product documentation is based upon the technical documentation guideline of altexsoft (2019 [1]).

### 1.2. Definitions, Acronyms, Abbreviations

- ACCS - Atomic cross-chain swaps
- AMOS - Agile methods and Open-Source Software
- API - Application Programming Interface
- BOM - Bill of materials
- BTC - Bitcoin
- BTS - Bitshares
- CLI - Command line interface
- ECDSA - Elliptic Curve Digital Signature Algorithm
- FAU - Friedrich-Alexander University Erlangen-Nürnberg
- HTLC - Hash time locked contract
- OTC - Over-the-counter
- UI - User Interface

## 2. System documentation

The following system documentation consists of a requirements document, architecture design principles, validation docs, verification and testing info.

### 2.1. Product requirements

Product requirements keep changing as the entire ACCS - Team is developing the product in an agile way / environment. Obviously, the overall requirements have been stated clearly at the beginning of the project and only non-core functionalities are affected by the changes. Otherwise the development would almost be impossible. The most important product requirements are:

- An exchange between BTC and BTS shall be conducted using HTLCs - it is assumed that the two exchanging parties know each other, yet by using a hashlock and a timelock, no mutual basis of trust is necessary between the two exchanging parties

- Private keys shall neither leave the browser nor be stored in a database, and they are also invisible to any other parties, including the exchanging parties

#### 2.1.1. Roles and responsibilities

Swapchain is a software product being developed by a group of students from the FAU, in the frame of the course "Agile Methods and Open Source" (AMOS) held by the Open Source Software Chair of Prof. Dr. Dirk Riehle. As the project unfolds according to the "Agile Methods" principles, roles and responsibilities can be clearly allocated:

- Industry partner: Dr.-Ing. Fabian Schuh, CEO of ChainSquad GmbH. Ordering the product, stating expectations regarding its features and giving advice concerning its technical realisation.

- Group coach: M. Sc. Sebastian Schmid from the FAU chair of Open Source Software. Advising and grading the groups' usage of agile methods, team meetings, process documentation as well as coding artifacts.

- Product owners: Katharina Fehn and Spyridon Koustas, students of the FAU. Leading the group during meetings, setting the general direction of the project, preparing backlogs for task fulfillment and delivering process artifacts.

- Developers: Julia Steffener, Mads Jordt, Nicolas Webersinke, Joab Rajkumar, Andreas Thomas, Kevin Kohler, students of the FAU. Developing, testing, demoing and deploying the product artifacts required for the software as well as maintaining documentation up to date.

- Revolving roles: release manager, scrum master and participants of a product backlog refinement meeting. While the release manager takes care of testing code artifacts and publishing weekly releases, the scrum master takes notes of non-technical impediments and aims to solve them in cooperation with the group. Furthermore, two members from the development team get together weekly with the two Product Owners to refine product backlog entries.

#### 2.1.2. Team goals and business objective

Team goals:  
The team's goals include both fulfilling the requirements about the application of the Scrum-method as communicated by the coach as well as deploying software that is satisfactory to the industry partner's expectations.
The team goals for fullfilling AMOS requirements include self-dependent and motivated participation in the project planning, meeting the schedules specified in the deliverables overview, appropriate usage and listing of third-party components with fitting licensing and taking care of proper documentation so that the development process can be retraced. The three main sources for assessing the work quality as postulated by AMOS are the weekly team meetings, the planning document and the published and tagged code artifacts accessible on GitHub.
The team goals for satisfying the industry partner consist of delivering a minimum viable product (MVP) ready for further (final) development and eventual commercial utilisation. Hereby, the team aims at delivering flawless code components, a clean software architecture and documentation papers of high quality, all of which are considered the main source for assessing work quality from the industry partner's side.

Business objective:  
The Swapchain business objective is to offer an application to trade different cryptocurrencies across multiple blockchains with each other. Realising atomic over-the-counter (OTC) transactions that feature hash time locked contracts (HTLC) and - in a final version - real-time orderbooks, Swapchain is determined to place a safe, reliable and lightweight solution for the atomic exchange of various cryptocurrency assets across different blockchains on the market. As the market for cryptocurrency applications based on distributed ledger technology experiences considerable growth, while technological approaches based on ACCS are only evolving, the product is expected to fill in a market gap and thus experience increasing user numbers across various target groups. Due to its intuitivity and ease-of-use, Swapchain is aimed at becoming a viable alternative to a large user base with an intermediate to advanced understanding of cryptocurrencies, a strong sense of data and risk protection and an intent to swap digital assets.

#### 2.1.3. Background and strategic fit

Background:  
The strategic aim of the Swapchain team is to develop an HTLC-backed cryptocurrency exchange software prototype that is as advanced and near to a final product as possible, despite its limited size of personnel and a time schedule of only one semester in total. The reason for building this product is initially determined in the AMOS course requirements (respectively the task assignment of the industry partner), however the practical realisation of the project and the self-expectation to develop the product as far as possible with the given resources stem from the intrinsic motivation of the Swapchain team. The tasks the team mainly fulfills can be rooted in multiple disciplines: While the technical tasks primarily consist of setting up a team-based coding and documentation environment, programming and testing new features and guaranteeing proper deployment for the next release candidate, there are also more managerial tasks. These include the update and further development of the planning document, the deliverance of process artifacts and arranging meetings with the industry partner to receive new input.

Strategic fit:  
Cryptocurrency exchange providers like Binance and StatCoin offer exchange of hundreds of different cryptocurrencies. Moreover, these providers store and manage their users' public and private keys.
However, Swapchain's unique selling point consists of the fact that it does not save any private keys of the users as any information regarding them stays in the browser and is not sent to any database. Also counterparty risks are minimized as the users themselves have to manage their secret hashes necessary for transactions. Thus, no trust towards the trading partner is needed and the transaction fees are significantly lower compared to its competitors.

#### 2.1.4. Assumptions

It is assumed that future users of the Swapchain web application have a good understanding of blockchains and cryptocurrencies. The reason being that users are self-responsible for their private and public keys. Moreover assets are going to be exchanged and transaction fees are applied.

#### 2.1.5. User stories

As a user of Swapchain, I want to exchange BTC for BTS or vice versa without trusting the other party. Also I do not want my private keys to be stored by the system and I want to have minimal reliance on a third party (Zipkin, 2020 [2]).

#### 2.1.6. User interaction and design

Swapchain offers its users two user interfaces:

- A responsive web app
- A command-line interface

Both are compatible with each other.

### 2.2. Design decisions

The user interface design principles established for Swapchain can be listed as follows:

Simplicity:  
Despite the complexity of its underlying technology and the expected skill level of its users regarding cryptocurrencies, the design of the Swapchain interface is held in a minimalistic, unclogged structure. This is due to the fact that for ACCS input fields for private keys, public keys, addresses, fees, timelocks and bid and ask amounts and types are needed. To simply ask the user for these input is sufficient to be able to conduct an ACCS. Therefore, no further "fancy" functionalities are implemented in the prototype. The application is mobile-responsive to make trading comfortable with any device.

Intuitivity:  
Second, the Swapchain application is expected to provide an intuitive, easy-to-use interface. While related to the first aspect (simplicity), ease-of-use also includes the necessity of aspects such as obvious call to action to start trading. Moreover, users must be enabled to give input into the application without circumstances, which could for instance appear in the form of autofill patterns if they repeatedly want to set up the same swap offer. Moreover, barrier-free accessibility is also an important topic to be covered, however this functionality makes sense to be rolled out only when all other basic features have been implemented. Voice commands (of course excluding sensitive parts such as private keys) could prove viable support for impaired people imaginably.

Adaptability:
With more sophisticated versions of the software, users are given more opportunities to adapt the software design according to their own needs. This might include an activatable retrospective and analysis on prior transactions if the user wishes to receive in-depth intel on previous swaps.

Reliability:  
The user interface must clearly inform the users about any important event regarding the pending transactions. This includes understandable notifications, for example when a refund is granted due to an exceeded timelock, if a transaction was successful or whether the process is still ongoing and therefore the users need to stay in the browser. Furthermore, users must be given obstacle-free opportunities to receive timely support, especially in an area as delicate as assets trading.

Flexibility:
The users can choose the cryptocurrencies they wish to swap, as well as the fees (resulting in shorter or longer transaction durations). Thus, they are granted a high degree of flexibility while trading.

#### 2.2.1. User personas

![Description of user persona pathway](/img/UserPersona.jpg)

Figure 1: User Persona Pathway Diagram (Swapchain, 2020a) [3]

A typical user persona for Swapchain would be Alice. Alice has been trading with cryptocurrencies for quite a while and is well-educated with regards to this topic and its underlying technologies. Moreover, Alice is concerned with data protection and privacy and thus convinced that even when it comes to web-based transactions, as much information as possible should remain in her area of influence without being forwarded and stored by third parties.

#### 2.2.2. User scenario

As a user I am either in possession of BTC, BTS or both. Let us assume I am in possession of BTCs. However, I would like to exchange BTC for BTS so that I am also in possession of BTS. Since I do not want to trust the counterparty, I want to have maximum guarantees that my cryptocurrency exchange meets these requirements. As I already have an exchange partner, Swapchain offers my desired services and satisfies my needs. I simply access the Swapchain app and put my information, such as currency and amount I want to swap, priority to increase or decrease the probability that my transaction gets included in the next block and my private key to sign the transaction. Subsequently, the web app generates a secret hash that serves as the hashlock on the created ACCS. I pass this hashed secret to my exchange partner so he/she can put the same hashlock on the counterpart transaction. Now, the ACCS is triggered. If everything goes well, I have successfully exchanged BTC for BTS. If my swap partner tries to fool the system or the timelock runs out of time, the swap is cancelled and I get my BTC refunded.

### 2.3. Architecture descriptions

For an extensive description of the software architecture, please refer to the official Swapchain software architecture document (Swapchain, 2020b [4]) accessible under: https://github.com/chronark/swapchain/blob/master/docs/docs/software-architecture.md.

### 2.4. Quality assurance

The proper quality of the software is ensured by continuous testing and deploying. For this reason, a test environment was set up covering all quality aspects of the code artifacts.

#### 2.4.1. Test strategy

Swapchain follows a test-driven development (TDD) approach which is a best practice in software development. This indicates that tests for the respective functions are developed first in order to achieve two outcomes: first, to ensure higher software quality in general and second, to determine beforehand which functionalities of the respective code artifact are critical to run successfully.

#### 2.4.2. Test plan

Unit tests are implemented in jest and a 65% code line coverage is enforced as pre-commit hook. To ensure code quality and standards we use eslint with prettier. We test against the node.js LTS version (12) as well as the current 14.x version.

## 3. User documentation

The user documentation is intended to explain in the shortest way possible how the software can help users solve their problems. Initially, it provides information and guidance for end-users on how to utilise the software, while at later stages, system administrators could also be taught on operating the software.

### 3.1. Product feature description

At its core, Swapchain makes use of HTLCs. Therefore theoretically any cryptocurrency can be exchanged whose blockchain supports HTLCs. While it is planned to support more currencies, only Bitcoin and Bitshares are currently offered as an exchange pair. Creating and redeeming HTLCs on Bitshares is fairly simple, since operations from the core software exist for this. This is not the case for Bitcoin. For the Bitcoin blockchain, Swapchain makes use of a custom redeemscript. The script looks similar to this: (Zipkin, 2020 [2])

```
OP_IF
  OP_SHA256
  <hash of secret>
  OP_EQUALVERIFY
  <pubKey of counterparty>
  OP_CHECKSIG
OP_ELSE
  <relative locktime>
  OP_CHECKSEQUENCEVERIFY
  OP_DROP
  <pubKey of refund>
  OP_CHECKSIG
OP_ENDIF
```

Without going deep into details, this script implements the HTLCs for Bitcoin. As can be seen from `OP_CHECKSIG`, a valid signature must always be present for redeeming in addition to opening the hash or timelock. In addition, a 32-character cryptographically random secret ensures high security.
Combined with full use of segwit, we can offer our users a safe, fast and cheap way to exchange Bitcoin and Bitshares.

![Description of product feature](../static/img/Features.jpg)

Figure 2: Product feature diagram (Swapchain, 2020c) [5]

### 3.2. Tutorials

#### 3.2.1 Web App Interface functionality explanation

![Landing Page Interface](/img/UI_screenshot_landingPage.svg)

Figure 3: Screenshot of the landing page interface (Swapchain, 2020d) [6]

1. Button to the trading page
2. Link leading to explanation of how to use the command-line-interface
3. Link to orderbook to store and browse open orders (currently work-in-progress)
4. Link leading to software documentation
5. Logo leading to GitHub repository
6. Button to start trading either as a proposer or an acceptor
7. Link leading to GitHub repository

---

![Choose Trade Mode Interface](/img/UI_screenshot_chooseTradeMode.svg)

Figure 4: Screenshot of the trade mode choice interface (Swapchain, 2020e) [7]

1. Home Button
2. ACCS Proposer Mode Choice
3. ACCS Accepter Mode Choice
4. Button to confirm mode choice and lead the user to the respective form

---

![Proposer Form Interface](/img/UI_screenshot_proposerForm.svg)

Figure 5: Screenshot of the proposer form interface (Swapchain, 2020f) [8]

1. Setting up the HTLC on the mainnet.
2. Seeting up the HTLC on the testnet.
3. Giving away Bitcoin to receive Bitshares from the swap partner.
4. Giving away Bitshares to receive Bitcoin from the swap partner.
5. The amount of Bitcoin that you wish to exchange.
6. The exchange rate between Bitcoin and Bitshares the two partners want to apply in their exchange. E.g. when you want to trade 0.001 Bitcoin for 10 Bitshares, the exchange rate would be 10,000.
7. Amout you receive in the respective countercurrency after applying the exchange rate to the amout of currency you give away.
   **Your Data:**
8. Insert field for your Bitcoin private key to validate the set up of an HTLC.
9. Insert field for your Bitshares private key used to validate the receival of Bitshares from a swap partner's HTLC.
10. Insert field for Bitcoin Transaction ID to identify the transaction's output supposed to be used as the input for the HTLC.
    **Counterparty Data:**
11. Insert field for the counterparty's Bitcoin Public Key as the destination for HTLC's funds.
12. Insert field for the counterparty's Bitshares account name as the destination for the HTLC's funds.
13. Choice of priority and speed of transaction processing via choosing either a high, medium or low amount of transaction fees.
14. Submit the information to create the HTLC on the blockchain.

---

![Accepter Form Interface](/img/UI_screenshot_accepterForm.svg)

Figure 6: Screenshot of the accepter form interface (Swapchain, 2020g) [9]

1. Setting up the HTLC on the mainnet.
2. Setting up the HTLC on the testnet.
3. Giving away Bitcoin to receive Bitshares from the swap partner.
4. Giving away Bitshares to receive Bitcoin from the swap partner.
5. The amount of Bitshares that you wish to exchange.
6. The exchange rate between Bitcoin and Bitshares the two partners want to apply in their exchange. E.g. when you want to trade 0.001 Bitcoin for 10 Bitshares, the exchange rate would be 10.000.
7. Amout you receive in the respective countercurrency after applying the exchange rate to the amout of currency you give away.
   **Your Data:**
8. Insert field for your Bitcoin private key used to validate the receival of Bitshares from a swap partner's HTLC.
9. Insert field for your Bitshares private key to validate the set up of an HTLC.
10. Insert field for Bitcoin Transaction ID to identify the transaction's output supposed to be used as the input for the HTLC.
    **Counterparty Data:**
11. Insert field for the counterparty's Bitcoin Public Key as the destination for HTLC's funds.
12. Insert field for the counterparty's Bitshares account name as the destination for the HTLC's funds.
13. Insert field for secret hash given to you by your swap partner to set up an HTLC with the same secret hash.
14. Choice of priority and speed of transaction processing via choosing either a high, medium or low amount of transaction fees.
15. Submit the information to create the HTLC on the blockchain.

---

![Information for Partner Interface](/img/UI_screenshot_infoToPartner.svg)

Figure 7: Screenshot of the information for partner interface (Swapchain, 2020h) [10]

1. The secret hash you have to pass to your swap partner in order for him/her to set up an HTLC with the same secret hash.
2. Your Bitcoin Public Key as information for your partner in order to set up the counter-HTLC.
3. Button to copy all the information to easily send it to your swap partner via any means of communication.

---

![Transaction Processing Interface](/img/UI_screenshot_transactionProcessing.svg)

Figure 8: Screenshot of the transaction processing interface (Swapchain, 2020i) [11]

1. Don't leave the browser until you do get shown a success of failure notification. Your transaction is being processed.

---

![Success Notification Page Interface](/img/UI_screenshot_success.svg)

Figure 9: Screenshot of the success notification interface (Swapchain, 2020j) [12]

1. Your transaction was successfully processed and can be seen on the blockchain.

---

![Failure Notification Page Interface](/img/UI_screenshot_failure.svg)

Figure 10: Screenshot of the failure notification interface (Swapchain, 2020k) [13]

1. Something went wrong during the transaction processing. Funds previously sent to the HTLC are refunded. If not, you may refund them manually.

#### 3.2.2 Command Line Interface functionality explanation

![Starting Page Command Line Interface](/img/CLI_screenshot_startingPage.svg)

Figure 11: Screenshot of the command line interface starting page (Swapchain, 2020l) [14]

1. You can start the CLI with:
   - A. "npm run build:cli"
   - B. "node build/cli/index.js --help" (the help flag shows you the different options to interact with the CLI).
   - Running the command without the help flag starts the tool in the interactive mode (as default).

---

![User type Choice Command Line Interface](/img/CLI_screenshot_proposerAccepter.svg)

Figure 12: Screenshot of the command line interface user type choice (Swapchain, 2020m) [15]

1. Using the arrow keys, you can choose between proposer and accepter mode. Hitting enter makes the CLI go to the next step.

---

![User Input Check Command Line Interface](/img/CLI_screenshot_checkInput.svg)

Figure 13: Screenshot of the command line interface user input check (Swapchain, 2020n) [16]

1. The CLI checks the validity of the information you enter and eventually makes you submit correct data.

---

![Proposer Hash Pass Command Line Interface](/img/CLI_screenshot_passHash.svg)

Figure 14: Screenshot of the command line interface proposer hash pass (Swapchain, 2020o) [17]

1. Once you submitted all the information, stay in the CLI until you get a notification about the ACCS completion and pass the secret hash along with your Bitcoin public key and Bitshares account.

---

![Accepter Hash Pass Command Line Interface](/img/CLI_screenshot_passHash2.svg)

Figure 15: Screenshot of the command line interface accepter hash pass (Swapchain, 2020p) [18]

1. Proposer and accepter steps are basically the same, with the different that as an accepter you have to pass the secret hash given to you by the swap partner.

---

![Success Page Command Line Interface](/img/CLI_screenshot_success.svg)

Figure 16: Screenshot of the command line interface success page (Swapchain, 2020q) [19]

1. As soon as the swap took place, both users are notified about the successful swap. After this notification, the users are free to close the CLI.

### 3.3. User guides

#### 3.3.1 How do I get started?

To trade cryptocurrency with Swapchain no user account is needed. You just enter the web app or the CLI and provide the needed information. Please note that this user guide is written for the web app. The CLI works similar, but is more suitable for experienced users. For frequent users, the CLI also offers the possibility to read the corresponding data from a JSON Config file.

#### 3.3.2 What information do I need to trade?

- Your private keys for both cryptocurrencies. For privacy reasons, we recommend that you always use a fresh key pair for Bitcoin. Please note that we only accept transactions from p2wpkh addresses (segwit) as input.
- The Bitcoin public key (compressed or uncompressed) and the Bitshares account name of the counterparty.

#### 3.3.3 What parameters can I set?

- Bid Amount: The amount of currency you want to give away.
- Ask Amount: The amount of currency you want to receive.
- Bid Type: The type of cryptocurrency you want to give away (BTC/BTS).
- Ask Type: The type of cryptocurrency you want to receive (BTC/BTS).
- Transaction fee priority: Transaction fees you want to pay for your order to be processed. The lower the transaction fee the longer the transaction will take (Low/Medium/High priority and transaction fees respectively).

#### 3.3.4 How do I initiate the swap?

1. Enter the Swapchain app and choose the proposer option in order to initiate a swap.
2. Fill out the form with all the needed information and click Submit.
3. A secret hash is generated. Copy the hash and send it to your exchange partner together with your Bitcoin public key and your Bitshares account name.
4. Stay in the browser until the transaction is completed. Do not leave the browser by any means. You need to have a stable internet connection throughout the transaction.
5. After the the successful transaction or redemption because of timelock expiry you are notified and free to leave the browser.

#### 3.3.5 How do I complete the swap as a counterpart?

1. Enter the Swapchain app and choose the option to accept a swap.
2. Fill out the form with all the needed information and the secret hash that was previously passed to you by your exchange partner that set up the ACCS.
3. Click Submit.
4. Do not leave the browser before receiving a notification of either a successful transaction or failure.

#### 3.3.6 What happens if something goes wrong?

In case your exchange partner does not react to the swap you will be refunded your assets as soon as the timelock expires.
In case of technical issues you may refund your Bitcoin HTLC manually. Your Bitshares HTLC gets refunded automatically.
Kindly note however that our software is MIT licensed and therefore comes without any warranty or liability.

### 3.4. Troubleshooting

In any case of system errors or malfunctions, please [open a new issue on github](https://github.com/chronark/swapchain/issues).

## 4. References

1. altexsoft (2019). Technical Documentation in Software Development: Types, Best Practices, and Tools. Retrieved from https://www.altexsoft.com/blog/business/technical-documentation-in-software-development-types-best-practices-and-tools/

2. Zipkin, M. (2020). What are cross-chain atomic swaps? Retrieved from https://bcoin.io/guides/swaps.html

3. Swapchain (2020a). User persona pathway diagram. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

4. Swapchain (2020b). Software architecture. Retrieved from https://github.com/chronark/swapchain/blob/master/docs/docs/architecture.md

5. Swapchain (2020c). Product feature diagram. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

6. Swapchain (2020d). Screenshot of the landing page interface. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

7. Swapchain (2020e). Screenshot of the trade mode choice interface. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

8. Swapchain (2020f). Screenshot of the proposer form interface. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

9. Swapchain (2020g). Screenshot of the accepter form interface. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

10. Swapchain (2020h). Screenshot of the information for partner interface. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

11. Swapchain (2020i). Screenshot of the transaction processing interface. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

12. Swapchain (2020j). Screenshot of the success notification interface. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

13. Swapchain (2020k). Screenshot of the failure notification interface. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

14. Swapchain (2020l). Screenshot of the command line interface starting page. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

15. Swapchain (2020m). Screenshot of the command line interface user type choice. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

16. Swapchain (2020n). Screenshot of the command line interface user input check. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

17. Swapchain (2020o). Screenshot of the command line interface proposer hash pass. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

18. Swapchain (2020p). Screenshot of the command line interface accepter hash pass. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img

19. Swapchain (2020q). Screenshot of the command line interface success page. Retrieved from https://github.com/chronark/swapchain/tree/master/docs/docs/img
