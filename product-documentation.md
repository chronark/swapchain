---
id: product-documentation
title: Swapchain Product Documentation
sidebar_label: Swapchain Product Documentation
---

## 1. Introduction

This document provides information regarding the product of Swapchain from the project course AMOS at Friedrich-Alexander-University Erlangen-Nuremberg. Atomic cross-chain swaps between Bitcoin and Bitshares are at Swapchain's core. This product documentation serves as guideline for potential business users who have observed a similar use case within their respective organization(s).

### 1.1. Notes: 

- The following product documentation is based upon the technical documentation guideline of altexsoft (2019 [1]).

- Chapters marked with "***" are not specified yet due to the necessity of further planning and will be completed upon the final release.

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

The following system documentation consists of a requirements document, architecture design principles, validation docs, verification and testing info. The documentation will be enchanced in the course of the project.

### 2.1. Product requirements

Product requirements keep changing as the entire ACCS - Team is developing the product in an agile way / environment. Obviously, the overall requirements have been stated clearly at the beginning of the project and only non-core functionalities are affected by the changes. Otherwise the development would almost be impossible. The most important product requirements are:

 - An exchange between BTC and BTS shall be conducted using HTLC

 - Public keys, private keys, or addresses shall neither leave the browser nor be stored in a database

 - ***

#### 2.1.1. Roles and responsibilities

Swapchain is a software product being developed by a group of students from the Friedrich-Alexander-University Erlangen-Nuremberg (FAU), in the frame of the course "Agile Methods and Open Source" (AMOS) held by the Open Source Software Chair of Prof. Dr. Dirk Riehle. As the project unfolds according to the "Agile Methods" principles, roles and responsibilites can be clearly allocated:

- Industry partner: Dr.-Ing. Fabian Schuh, CEO of ChainSquad GmbH. Ordering the product, stating expectations regarding its features and giving advice concerning its technical realisation.

- Group coach: M. Sc. Sebastian Schmid from the FAU chair of Open Source Software. Advising and grading the groups' usage of agile methods, team meetings, process documentation as well as coding artifacts.

- Product owners: Katharina Fehn and Spyridon Koustas, students of the FAU. Leading the group during meetings, setting the general direction of the project, preparing backlogs for task fulfillment and delivering process artifacts.

- Developers: Julia Steffener, Mads Jordt, Nicolas Webersinke, Joab Rajkumar, Andreas Thomas, Kevin Kohler, students of the FAU. Developing, testing, demoing and deploying the product artifacts required for the software.

- Revolving roles: release manager and scrum master. While the release manager takes care of testing code artifacts and publishing weekly releases, the scrum master takes notes of non-technical impediments and aims to solve them in cooperation with the group.

#### 2.1.2. Team goals and business objective

Team goals:  
The team's goals include both fulfilling the requirements of the AMOS course as communicated by the coach as well as deploying software that is satisfactory to the industry partner's expectations. 
The team goals for fullfilling AMOS requirements include self-dependent and motivated participation in the project planning, meeting the schedules specified in the deliverables overview, appropriate usage and listing of third-party components with fitting licensing and taking care of proper documentation so that the development process can be retraced. The three main sources for assessing the work quality as postulated by AMOS are the weekly team meetings, the planning document and the published and tagged code artifacts accessible on GitHub.
The team goals for satisfying the industry partner consist of delivering a software prototype ready for further (final) development and eventual commercial utilisation. Hereby, the team aims at delivering flawless code components, a clean software architecture and documentation papers of high quality, all of which are considered the main source for assessing work quality from the industry partner's side.

Business objective:  
The Swapchain business objective is to offer a popular platform able to trade different cryptocurrencies across multiple blockchains with each other. Realising atomic over-the-counter (OTC) transactions that feature hash-time-locked contracts (HTLC) and real-time orderbooks, Swapchain is determined to place a safe, reliable and lightweight solution for the atomic exchange of various cryptocurrency assets across different blockchains on the market. As the market for cryptocurrency applications based on distributed ledger technology experiences considerable growth, while technological approaches based on ACCS are only evolving, the product is expected to fill in a market gap and thus experience increasing user numbers across various target groups. Due to its intuitivity and ease-of-use, Swapchain is aimed at becoming a viable alternative to a large user base with an intermediate to advanced understanding of cryptocurrencies, a strong sense of data and risk protection and an intent to swap digital assets.

#### 2.1.3. Background and strategic fit

Background:  
The strategic aim of the Swapchain team is to develop an HTLC-backed cryptocurrency exchange software prototype that is as advanced and near to a final product as possible, despite its limited size of personnel and a time schedule of only one semester in total. The reason for building this product is initially determined in the AMOS course requirements (respectively the task assignment of the industry partner), however the practical realisation of the project and the self-expectation to develop the product as far as possible with the given resources stem from the intrinsic motivation of the Swapchain team. The tasks the team mainly fulfills can be rooted in multiple disciplines: While the technical tasks primarily consist of setting up a team-based coding and documentation environment, programming and testing new features and guaranteeing proper deployment for the next release candidate, there are also more managerial tasks. These include the update and further development of the planning document, the deliverance of process artifacts and arranging meetings with the industry partner to receive new input.

Strategic fit:  
Cryptocurrency exchange providers like Binance and StatCoin offer exchange of hundreds of different cryptocurrencies. Moreover, these providers store and manage their users' public and private keys. 
However, Swapchain's unique selling point consists of the fact that it does not save any private or public keys of the users. Also counterparty risks are minimized as the users themselves have to manage their keys necessary for transactions. Thus, no trust towards the trading partner is needed and the transaction fees are significantly lower compared to its competitors.

#### 2.1.4. Assumptions

It is assumed that future users of the Swapchain web application have a good understanding of blockchains and cryptocurrencies. The reason being that users are self-responsible for their private and public keys. Moreover assets are going to be exchanged and transaction fees may be applied.

#### 2.1.5. User stories

As a user of Swapchain, I want to exchange BTC for BTS or vice versa without trusting the other party. Also I do not want my personal or private keys to be stored by the system and I do not want to rely on a third party (Zipkin, 2020 [2]).

#### 2.1.6. User interaction and design

The system communicates with the user via a user interface (UI). React.js will be used to create a basic frontend. Moreover, a database will be used as the orderbook.
Design explorations and wireframes will be added as soon as they are finalised for the Swapchain application.

***

### 2.2. Design decisions

The user interface design principles established for Swapchain can be listed as follows: 

Simplicity:  
Despite the complexity of its underlying technology and the expected skill level of its users regarding cryptocurrencies, the design of the Swapchain interface is held in a minimalistic, unclogged structure. This is due to the fact that for ACCS, an uncluttered orderbook providing overview over transactions, a few input fields for private keys etc. and a small number of possible notification push-apps should suffice for the first. Of course, within the application's settings more preferences can be adjusted, however these options are not imposed onto those users only wanting to swap cryptocurrencies in a time-efficient and secure way.

Intuitivity:  
Second, the Swapchain application is expected to provide an intuitive, easy-to-use interface. While related to the first aspect (simplicity), ease-of-use also includes the necessity of aspects such as obvious calls to action, for example if users needs to register for an account first or want to quickly browse existing swap offers. Moreover, users must be enabled to give input into the application without circumstances, which could for instance appear in the form of autofill patterns if they repeatedly want to set up the same swap offer. Moreover, barrier-free accessibility is also an important topic to be covered, however this functionality makes sense to be rolled out only when all other basic features have been implemented. Then, voice commands (of course excluding sensitive parts such as private keys) could prove viable support for impaired people.

Adaptability:  
With more sophisticated versions of the software, users are given more opportunities to adapt the software design according to their own needs. This might include an activatable retrospective and analysis on prior transactions if the user wishes to receive in-depth intel on previous swaps.

Reliability:  
The user interface must clearly inform the user about any important event regarding the pending transactions. This includes understandable notifications, for example when a refund is granted due to an exceeded timelock or if a transaction was successful. Furthermore, users must be given obstacle-free opportunities to receive timely support, especially in an area as delicate as assets trading.

#### 2.2.1. User personas

!(Description of user persona pathway)[static/img/UserPersona.jpg]
Figure 1: User Persona Pathway Diagram (Swapchain, 2020a) [3]

A typical user persona for the Swapchain would be Bob/Alice. Bob/Alice, 27 years old, just recently graduated from his/her (technological) studies at a university with a degree. Two months ago, he/she entered professional life in a corporation where he/she is in an occupation situated at the interface between tech and business, such as technical procurement or process optimisation. As he/she just recently began to earn a regular wage summing up to 47.000 € gross salary annually, he/she is now looking for investment opportunities - and as a tech-savvy person also interested in stocks, exchange rate gains and comparable investments, cryptocurrencies have (besides the technology itself) sparked his/her interest. Nonetheless, he/she is self-explanatory a responsible person that does not want to invest his/her first few wages in sketchy investment options risking to lose it all. Therefore, a sufficient level of security is inevitable to persuade Bob/Alice to invest in these assets and the underlying ACCS technology. Moreover, Bob/Alice is concerned with data protection and thus convinced that even when it comes to web-based transactions, as much information as possible should remain in his/her area of influence without being forwarded to third parties without prior consent.

#### 2.2.2. User scenario

As a user I am either in possession of BTC, BTS or both. Let us assume I am in possession of BTCs. However, I would like to exchange BTC for BTS so that I am also in possession of BTS. Since I want to avoid counterparty risks and I do not trust people I do not know, I want to have maximum guarantees that my cryptocurrency exchange meets these requirements. Swapchain offers my desired services and satisfies my needs. Hence, I create a user account where minimal personal information is needed. Once registered, I can log in and check the orderbook for potential swap offers. Moreover, I can add my own swap offer to the orderbook. If I find a fitting swap offer or if someone accepts my previously posted swap offer, I start the ACCS by confirming the order in the orderbook. Now, the ACCS is triggered. If everything goes well, I have successfully exchanged BTC for BTS. If my swap partner tries to fool the system or the time lock runs out of time, the transaction is cancelled and I receive my refunded BTC.

#### 2.2.3. UX style guide

***

### 2.3. Architecture descriptions

For an extensive description of the software architecture, please refer to the official Swapchain software architecture document (Swapchain, 2020b [4]) accessible under: https://github.com/chronark/swapchain/blob/master/docs/docs/architecture.md.

### 2.4. Quality assurance

The proper quality of the software is ensured by continuous testing and deploying. For this reason, a test environment was set up covering all quality aspects of the code artifacts.

#### 2.4.1. Test strategy

Swapchain follows a test-driven development (TDD) approach which is a best practice in software development. This indicates that tests for the respective functions are developed first in order to achieve two outcomes: first, to ensure higher software quality in general and second, to determine beforehand which functionalities of the respective code artifact are critical to run successfully.

#### 2.4.2. Test plan

Unit tests are implemented in jest and a 70% code coverage is enforced as pre-commit hook. To ensure code quality and standards we use eslint with prettier. UI tests will be done using cypress.io. We test against the node LTS version (12) as well as the current 14.x version.

## 3. User documentation

The user documentation is intended to explain in the shortest way possible how the software can help users solve their problems. Initially, it provides information and guidance for end-users on how to utilise the software, while at later stages, system administrators could also be taught on operating the software.

### 3.1. Product feature description

!(Description of product feature)[static/img/Features.jpg]
Figure 2: Product feature diagram (Swapchain, 2020c) [5]

### 3.2. Tutorials

***

### 3.3. User guides

***

### 3.4. Troubleshooting

In any case of system errors or malfunctions, please do not hesitate to contact ChainSquad GmbH.

## 4. References

1. altexsoft (2019). Technical Documentation in Software Development: Types, Best Practices, and Tools. Retrieved from https://www.altexsoft.com/blog/business/technical-documentation-in-software-development-types-best-practices-and-tools/

2. Zipkin, M. (2020). What are cross-chain atomic swaps? Retrieved from https://bcoin.io/guides/swaps.html

3. Swapchain (2020a). User Persona Pathway Diagram. Retrieved from https://github.com/chronark/swapchain/tree/dev/docs/static/img

4. Swapchain (2020b). Software architecture. Retrieved from https://github.com/chronark/swapchain/blob/master/docs/docs/architecture.md

5. Swapchain (2020c). Product feature diagram. Retrieved from https://github.com/chronark/swapchain/tree/dev/docs/static/img