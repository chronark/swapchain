---
id: product-documentation
title: Swapchain Product Documentation
sidebar_label: Swapchain Product Documentation
---

## 1. Introduction

This document provides information regarding the product of Swapchain from the project course AMOS at Friedrich-Alexander-University Erlangen-Nuremberg. Atomic cross-chain swaps between Bitcoin and Bitshares are at Swapchain's core. This product documentation serves as guideline for potential business users who have observed a similar use case within their respective organization(s).

### 1.1. Notes: 

- The following product documentation is based upon the technical documentation guideline of altexsoft (2019 [1]).

### 1.2. Definitions, Acronyms, Abbreviations

AMOS   -   Agile methods and Open-Source Software  
ACCS   -   Atomic cross-chain swaps  
HTLC   -   Hash-time-locked contract  
ECDSA  -   Elliptic Curve Digital Signature Algorithm  
BTC    -   Bitcoin  
BTS    -   Bitshare  
OTC    -   over-the-counter  
REST   -   Representational State Transfer  
API    -   Application Programming Interface  
UI     -   User Interface  
BOM    -   Bill of materials  
GCE    -   Google Compute Engine  
SaaS   -   Software as a Service    

## 2. System documentation

The following system documentation consists of a requirements document, architecture design principles, validation docs, verification and testing info.

### 2.1. Product requirements

Product requirements keep changing as the entire ACCS - Team is developing the product in an agile way / environment. Obviously, the overall requirements have been stated clearly at the beginning of the project and only non-core functionalities are affected by the changes. Otherwise the development would almost be impossible. The most important product requirements are:

 - An exchange between BTC and BTS shall be conducted using HTLC - it is assumed that the two exchanging parties know each other  

 - Public keys, private keys, or addresses shall neither leave the browser nor be stored in a database

#### 2.1.1. Roles and responsibilities

Swapchain is a software product being developed by a group of students from the Friedrich-Alexander-University Erlangen-Nuremberg (FAU), in the frame of the course "Agile Methods and Open Source" (AMOS) held by the Open Source Software Chair of Prof. Dr. Dirk Riehle. As the project unfolds according to the "Agile Methods" principles, roles and responsibilites can be clearly allocated:

- Industry partner: Dr.-Ing. Fabian Schuh, CEO of ChainSquad GmbH. Ordering the product, stating expectations regarding its features and giving advice concerning its technical realisation.

- Group coach: M. Sc. Sebastian Schmid from the FAU chair of Open Source Software. Advising and grading the groups' usage of agile methods, team meetings, process documentation as well as coding artifacts.

- Product owners: Katharina Fehn and Spyridon Koustas, students of the FAU. Leading the group during meetings, setting the general direction of the project, preparing backlogs for task fulfillment and delivering process artifacts.

- Developers: Julia Steffener, Mads Jordt, Nicolas Webersinke, Joab Rajkumar, Andreas Thomas, Kevin Kohler, students of the FAU. Developing, testing, demoing and deploying the product artifacts required for the software as well as maintaining documentation up to date.

- Revolving roles: release manager, scrum master and participants of a product backlog refinement meeting. While the release manager takes care of testing code artifacts and publishing weekly releases, the scrum master takes notes of non-technical impediments and aims to solve them in cooperation with the group. Furthermore, two members from the development team get together weekly with the two Product Owners to refine product backlog entries. 

#### 2.1.2. Team goals and business objective

Team goals:  
The team's goals include both fulfilling the requirements about the application of the Scrum-method as communicated by the coach as well as deploying software that is satisfactory to the industry partner's expectations. 
The team goals for fullfilling AMOS requirements include self-dependent and motivated participation in the project planning, meeting the schedules specified in the deliverables overview, appropriate usage and listing of third-party components with fitting licensing and taking care of proper documentation so that the development process can be retraced. The three main sources for assessing the work quality as postulated by AMOS are the weekly team meetings, the planning document and the published and tagged code artifacts accessible on GitHub.
The team goals for satisfying the industry partner consist of delivering a functional software prototype ready for further (final) development and eventual commercial utilisation. Hereby, the team aims at delivering flawless code components, a clean software architecture and documentation papers of high quality, all of which are considered the main source for assessing work quality from the industry partner's side.

Business objective:  
The Swapchain business objective is to offer a popular platform able to trade different cryptocurrencies across multiple blockchains with each other. Realising atomic over-the-counter (OTC) transactions that feature hash-time-locked contracts (HTLC) and real-time orderbooks, Swapchain is determined to place a safe, reliable and lightweight solution for the atomic exchange of various cryptocurrency assets across different blockchains on the market. As the market for cryptocurrency applications based on distributed ledger technology experiences considerable growth, while technological approaches based on ACCS are only evolving, the product is expected to fill in a market gap and thus experience increasing user numbers across various target groups. Due to its intuitivity and ease-of-use, Swapchain is aimed at becoming a viable alternative to a large user base with an intermediate to advanced understanding of cryptocurrencies, a strong sense of data and risk protection and an intent to swap digital assets.

#### 2.1.3. Background and strategic fit

Background:  
The strategic aim of the Swapchain team is to develop an HTLC-backed cryptocurrency exchange software prototype that is as advanced and near to a final product as possible, despite its limited size of personnel and a time schedule of only one semester in total. The reason for building this product is initially determined in the AMOS course requirements (respectively the task assignment of the industry partner), however the practical realisation of the project and the self-expectation to develop the product as far as possible with the given resources stem from the intrinsic motivation of the Swapchain team. The tasks the team mainly fulfills can be rooted in multiple disciplines: While the technical tasks primarily consist of setting up a team-based coding and documentation environment, programming and testing new features and guaranteeing proper deployment for the next release candidate, there are also more managerial tasks. These include the update and further development of the planning document, the deliverance of process artifacts and arranging meetings with the industry partner to receive new input.

Strategic fit:  
Cryptocurrency exchange providers like Binance and StatCoin offer exchange of hundreds of different cryptocurrencies. Moreover, these providers store and manage their users' public and private keys. 
However, Swapchain's unique selling point consists of the fact that it does not save any private or public keys of the users as any information stays in the browser and is not sent to any database. Also counterparty risks are minimized as the users themselves have to manage their secret hashes necessary for transactions. Thus, no trust towards the trading partner is needed and the transaction fees are significantly lower compared to its competitors.

#### 2.1.4. Assumptions

It is assumed that future users of the Swapchain web application have a good understanding of blockchains and cryptocurrencies. The reason being that users are self-responsible for their private and public keys. Moreover assets are going to be exchanged and transaction fees are applied. 

#### 2.1.5. User stories

As a user of Swapchain, I want to exchange BTC for BTS or vice versa without trusting the other party. Also I do not want my personal or private keys to be stored by the system and I do not want to rely on a third party (Zipkin, 2020 [2]).

#### 2.1.6. User interaction and design

The system communicates with the user via a user interface (UI). React.js will be used to create a basic frontend.

Furthermore, the user might use Swapchain's service via a command-line tool through any command prompt. 

### 2.2. Design decisions

The user interface design principles established for Swapchain can be listed as follows: 

Simplicity:  
Despite the complexity of its underlying technology and the expected skill level of its users regarding cryptocurrencies, the design of the Swapchain interface is held in a minimalistic, unclogged structure. This is due to the fact that for ACCS input fields for private keys, public keys, addresses, fees, timelocks and bid and ask amounts and types are needed. To simply ask the user for these input is sufficient to be able to conduct an ACCS. Therefore, no further "fancy" functionalities are implemented in the prototype. The application is mobile-responsive to make trading comfortable with any device.

Intuitivity:  
Second, the Swapchain application is expected to provide an intuitive, easy-to-use interface. While related to the first aspect (simplicity), ease-of-use also includes the necessity of aspects such as obvious call to action to start trading. Moreover, users must be enabled to give input into the application without circumstances, which could for instance appear in the form of autofill patterns if they repeatedly want to set up the same swap offer. Moreover, barrier-free accessibility is also an important topic to be covered, however this functionality makes sense to be rolled out only when all other basic features have been implemented. Voice commands (of course excluding sensitive parts such as private keys) could prove viable support for impaired people imaginably. 

Adaptability: 
With more sophisticated versions of the software, users are given more opportunities to adapt the software design according to their own needs. This might include an activatable retrospective and analysis on prior transactions if the user wishes to receive in-depth intel on previous swaps.

Reliability:  
The user interface must clearly inform the user about any important event regarding the pending transactions. This includes understandable notifications, for example when a refund is granted due to an exceeded timelock, if a transaction was successful or whether the process is still ongoing and therefore the user needs to stay in the browser. Furthermore, users must be given obstacle-free opportunities to receive timely support, especially in an area as delicate as assets trading.

#### 2.2.1. User personas

!(Description of user persona pathway)[static/img/UserPersona.jpg]
Figure 1: User Persona Pathway Diagram (Swapchain, 2020a) [3]

A typical user persona for the Swapchain would be Bob/Alice. Bob/Alice, 27 years old, just recently graduated from his/her (technological) studies at a university with a degree. Two months ago, he/she entered professional life in a corporation where he/she is in an occupation situated at the interface between tech and business, such as technical procurement or process optimisation. As he/she just recently began to earn a regular wage summing up to 47.000 € gross salary annually, he/she is now looking for investment opportunities - and as a tech-savvy person also interested in stocks, exchange rate gains and comparable investments, cryptocurrencies have (besides the technology itself) sparked his/her interest. Nonetheless, he/she is self-explanatory a responsible person that does not want to invest his/her first few wages in sketchy investment options risking to lose it all. Therefore, a sufficient level of security is inevitable to persuade Bob/Alice to invest in these assets and the underlying ACCS technology. Moreover, Bob/Alice is concerned with data protection and thus convinced that even when it comes to web-based transactions, as much information as possible should remain in his/her area of influence without being forwarded and stored by third parties.

#### 2.2.2. User scenario

As a user I am either in possession of BTC, BTS or both. Let us assume I am in possession of BTCs. However, I would like to exchange BTC for BTS so that I am also in possession of BTS. Since I want to avoid counterparty risks and I do not trust people I do not know, I want to have maximum guarantees that my cryptocurrency exchange meets these requirements. As I already have an exchange partner, Swapchain offers my desired services and satisfies my needs. I simply access the Swapchain app and put my information, such as currency and amount I want to swap, transaction fee priority to influence the speed of my block being mined and my private and public key to sign the transaction. Subsequently, the app generates a secret hash that serves as the hashlock on the created ACCS. I pass this hashed secret to my exchange partner so he/she can put the same hash lock on the counterpart transaction. Now, the ACCS is triggered. If everything goes well, I have successfully exchanged BTC for BTS. If my swap partner tries to fool the system or the time lock runs out of time, the transaction is cancelled and I receive my refunded BTC.

### 2.3. Architecture descriptions

For an extensive description of the software architecture, please refer to the official Swapchain software architecture document (Swapchain, 2020b [4]) accessible under: https://github.com/chronark/swapchain/blob/master/docs/docs/architecture.md.

### 2.4. Quality assurance

The proper quality of the software is ensured by continuous testing and deploying. For this reason, a test environment was set up covering all quality aspects of the code artifacts.

#### 2.4.1. Test strategy

Swapchain follows a test-driven development (TDD) approach which is a best practice in software development. This indicates that tests for the respective functions are developed first in order to achieve two outcomes: first, to ensure higher software quality in general and second, to determine beforehand which functionalities of the respective code artifact are critical to run successfully.

#### 2.4.2. Test plan

Unit tests are implemented in jest and a 65% code line coverage is enforced as pre-commit hook. To ensure code quality and standards we use eslint with prettier. UI tests will be done using cypress.io. We test against the node LTS version (12) as well as the current 14.x version.

## 3. User documentation

The user documentation is intended to explain in the shortest way possible how the software can help users solve their problems. Initially, it provides information and guidance for end-users on how to utilise the software, while at later stages, system administrators could also be taught on operating the software.

### 3.1. Product feature description

!(Description of product feature)[static/img/Features.jpg]
Figure 2: Product feature diagram (Swapchain, 2020c) [5]

### 3.2. Tutorials

#### 3.2.1 Interface functionality explanation 

//Landing Page Screenshot 

1. Button to start trading either as a proposer or an acceptor
2. Link leading to explanation of how to use the command-line-interface
3. Link to orderbook to store and browse open orders (currently work-in-progress) 
4. Link leading to software documentation
5. Link leading to GitHub repository
6. Button to start trading either as a proposer or an acceptor
7. Link leading to GitHub repository

// Choose Trade Mode Page 

1. Home Button 
2. ACCS Proposer Mode Choice 
3. ACCS Accepter Mode Choice 
4. Button to confirm mode choice and lead the user to the respective form

//Proposer Form 

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
10. Insert field for Bitcoin Transaction ID to identify the transaction's output supposed to be used as the input for the HTLC (applies only for the partner giving away Bitcoin). 
**Counterparty Data:**
11. Insert field for the counterparty's Bitcoin Public Key as the destination for HTLC's funds. 
12. Insert field for the counterparty's Bitshares account name as the destination for the HTLC's funds.
13. Choice of priority and speed of transaction processing via choosing either a high, medium or low amount of transaction fees. 
14. Submit the information to create the HTLC on the blockchain. 

//Accepter Form 

1. Setting up the HTLC on the mainnet. 
2. Seeting up the HTLC on the testnet. 
3. Giving away Bitcoin to receive Bitshares from the swap partner. 
4. Giving away Bitshares to receive Bitcoin from the swap partner. 
5. The amount of Bitshares that you wish to exchange. 
6. The exchange rate between Bitcoin and Bitshares the two partners want to apply in their exchange. E.g. when you want to trade 0.001 Bitcoin for 10 Bitshares, the exchange rate would be 10.000. 
7. Amout you receive in the respective countercurrency after applying the exchange rate to the amout of currency you give away.
**Your Data:** 
8. Insert field for your Bitcoin private key used to validate the receival of Bitshares from a swap partner's HTLC. 
9. Insert field for your Bitshares private key to validate the set up of an HTLC. 
**Counterparty Data:** 
10. Insert field for the counterparty's Bitcoin Public Key as the destination for HTLC's funds. 
11. Insert field for the counterparty's Bitshares account name as the destination for the HTLC's funds.
12. Insert field for secret hash given to you by your swap partner to set up an HTLC with the same secret hash.  
13. Choice of priority and speed of transaction processing via choosing either a high, medium or low amount of transaction fees. 
14. Submit the information to create the HTLC on the blockchain. 

//Information-for-Partner Page

1. The secret hash you have to pass to your swap partner in order for him/her to set up an HTLC with the same secret hash.
2. Your Bitcoin Public Key as information for your partner in order to set up the counter-HTLC. 
3. //ggf. Your Bitshares account name as information for your partner in order to set up the counter-HTLC. 
4. Button to copy all the information to easily send it to your swap partner via any means of communication. 

// Transaction Processing Page 

1. Don't leave the browser until you do not get shown a success of failure notification. Your transaction is being processed.

//Success notification page 

1. Your transaction was successfully processed and can be seen on the blockchain.

// Failure notification page 

1. Something went wrong during the transaction processing. Funds previously sent to the HTLC are refunded. 


**//Screencast - to be added** 


### 3.3. User guides

#### 3.3.1 How do I get started? 

To trade cryptocurrency with Swapchain no user account is needed. You just enter the app and provide the needed information. 

#### 3.3.2 What information do I need to trade? 

- Your crpytocurrency address: Alphanumeric characters representing the destination for a payment.
- Your public key: Part of the keys used for encryption and decryption of information. The public key enables message encryption only when the respective private key is used. Is of no value without the respective private key.
- Your private key: Secret key that should not be revealed to anybody else then the key owner.

#### 3.3.3 What parameters can I set? 

- Bid Amount: The amount of currency you want to give away. 
- Ask Amount: the amount of currency you want to receive. 
- Bid Type: The type of cryptocurrency you want to give away (BTC/BTS). 
- Ask Type: The type of cryptocurrency you want to receive (BTC/BTS). 
- Transaction fee priority: Transaction fees you want to pay for your order to be processed. The lower the transaction fee the longer the transaction will take (Low/Medium/High priority and transaction fees respectively).
- Timelock: The duration of the timelock being active on the HTLC. As soon as the timelock expires the currency from the pending transaction is refunded to the owner (Low/Medium/High duration of timelock). 

#### 3.3.4 How do I initiate the swap? 

1. Enter the Swapchain app and choose the proposer option in order to initiate a swap.
2. Fill out the form with all the needed information and click Submit. 
3. A secret hash is generated. Copy the hash and send it to your exchange partner together with your Bitcoin publickey and your Bitshares account name. 
4. Stay in the browser until the transaction is completed. Do not leave the browser by any means. 
5. After the the successful transaction or redemption because of timelock expiry you are notified and free to leave the browser. 

#### 3.3.5 How do I complete the swap as a counterpart? 

1. Enter the Swapchain app and choose the option to accept a swap.
2. Enter the hash that was previously passed to you by your exchange partner that set up the HTLC.
3. Sign the transaction with your provate key. 
4. Do not leave the browser before receiving a notification of either a successful transaction or failure.

#### 3.3.6 What happens if something goes wrong? 

In case your exchange partner does not react to the swap you will be refunded your money as soon as the timelock expires. 
In case of technical issues.... 
//müssen wir tatsächlich noch mal mit den anderen besprechen, was dann passiert. Das weiß ich nicht so recht. was sind denkbare Fälle, die eintreten können und den Swap verhindern könnten? 

### 3.4. Troubleshooting

In any case of system errors or malfunctions, please do not hesitate to contact ChainSquad GmbH.
Further information: https://chainsquad.com/contact. 

## 4. References

1. altexsoft (2019). Technical Documentation in Software Development: Types, Best Practices, and Tools. Retrieved from https://www.altexsoft.com/blog/business/technical-documentation-in-software-development-types-best-practices-and-tools/

2. Zipkin, M. (2020). What are cross-chain atomic swaps? Retrieved from https://bcoin.io/guides/swaps.html

3. Swapchain (2020a). User Persona Pathway Diagram. Retrieved from https://github.com/chronark/swapchain/tree/dev/docs/static/img

4. Swapchain (2020b). Software architecture. Retrieved from https://github.com/chronark/swapchain/blob/master/docs/docs/architecture.md

5. Swapchain (2020c). Product feature diagram. Retrieved from https://github.com/chronark/swapchain/tree/dev/docs/static/img