---
id: architecture
title: Swapchain Software Architecture
sidebar_label: Swapchain Software Architecture
---

## 1. Introduction

Swapchain is an application that enables users to perform atomic cross-chain swaps between Bitcoins and Bitshares and vice versa. It caters to the need of users who want to carry out OTC (over-the-counter) transactions between the Bitcoin and the Bitshares blockchains. The applicatiom helps users to submit desired swap orders and perform an hash time locked contract to safely carry out the swap. The use of an atomic cross-chain swap helps avoiding counterparty risks and high fees charged by other intermediaries and exchange venues. For the future it is planned to extend the application with an order book functionality to a trading platform. [5]

### 1.1 Purpose

This document provides a comprehensive architectural overview of the Swapchain application, using specific diagrams and an architectural representation to explain different aspects of the application. It is intended to capture and convey the significant architectural decisions which have been made for the application design.

### 1.2 Scope

The Swapchain application is being developed by a group of students from Friedrich-Alexander University Erlangen-Nürnberg to support cross-chain atomic swaps as part of an AMOS project. This software architecture document applies to each static and dynamic aspect of the platform. It includes an architectural model to explain the different processes that happen. Furthermore, it also discusses deployment and implementation issues.

### 1.3 Definitions, Acronyms, Abbreviations

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

### 1.4 Overview

The documentation will present a detailed analysis of the architecture of an application enabling ACCS between BTC and BTS. Initial sections of the document cover the architectural goals and constraints, use case realizations, and architectural representation. The later sections cover the specific details of the implementation and deployment of the platform. Furthermore, the document also describes the performance and quality.

## 2. Architectural Representation

Swapchain offers a CLI and a web app which both follow the Clean Architecture pattern. Main reason to use this pattern is to separate functions into layers and thus, improve the maintainability and reusability. Figure 1 visualizes the Clean Architecture by using color-coded schemes.

![](/img/CleanArchitecture.svg)  
Figure 1: The Clean Architecture (Martin, 2020) [3]

So, in the context of our application:

1. Yellow Layer: This layer is highly abstract, general, and thus very stable. Hence, in this case, the entity is the atomic swap of cryptocurrencies.
2. Red Layer: This layer contains the Use-Case, which is the swapping between two parties of BTC to BTS and vice versa.
3. Green Layer: This layer is used to separate the Red layer from the Blue layer. It has the framework specific code which is to be used by the application.
4. Blue Layer: This layer (framework and drivers) contains the web app and CLI.

| Clean Architecture Layers | Entities                                    | Use Cases                                | Controllers, Gateways, Presenters                           | UI, Web, Devices, DB          |
| ------------------------- | ------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------- | ----------------------------- |
| General Description       | Main features of the application            | Application of the main ideas            | Encapsulates framework-specific code                        | Contains frameworks and tools |
| Swapchain Specific        | Atomic cross-chain swap of cryptocurrencies | Cross-chain swaps, cross-consensus swaps | Interaction, libraries, data-structures from UI to use case | CLI, Web app                  |

A significant feature of this architecture is the flow of dependencies, which can be seen by the arrows moving in from the blue layer to the yellow layer in figure 1. This signifies that an outer layer can depend on an inner layer, but an inner layer cannot depend on an outer layer. The things that are most likely to change are kept on the outer layers and the things are less likely to change are kept on the inner most layers, helping the application to ensure possible changes that come over time due to technology changes etc. This makes the inner layers much more stable than the outer layers thus, the tools used to build the application can be modified easily (blue layer) but the core concepts and ideas behind the application are less likely to change (yellow layer). [3]

## 3. Logical and Code Component Overview

The logical view of Swapchain is comprised of 5 main components:

- Web app
- CLI
- ACCS class
- BitcoinHTLC class
- BitsharesHTLC class

Web app:  
The web app contains an interface for the user to propose or accept a swap. The web app sets the fields and calls the static method "run" to run the ACCS.

CLI:
The CLI offers the same functionalities as the web app. From the logical perspective, it works exactly like the web app. It is also possible to load JSON config files with the required data and use them for an ACCS.

ACCS class:
The ACCS class is the interface between the UIs and the HTLCs. Values set in the UI get parsed to a config using the parseUserInput method of the ACCS class. With this config, the ACCS class creates and redeems the respective HTLCs.

HTLC classes:
The HTLC classes have two main public methods. One to create and one to redeem an HTLC. The HTLC classes are supplemented by API classes to communicate with the corresponding nodes of the networks.

### 3.1. UML Diagram

![](/img/UML.svg)  
Figure 2: UML Diagram (Swapchain, 2020) [4]

## 4. Use Case

The use case diagram is used to visualize the Swapchain application and its actors.

### 4.1. Use Case Diagram

For the following use case diagram we assume that user 1 is in possession of Bitcoin while user 2 is in possession of Bitshares. Obviously, swapchain also supports swaps between these two cryptocurrencies that are vice versa, meaning user 1 proposes Bitshares in exchange for Bitcoin.

![](/img/UseCase.svg)  
Figure 3: Use Case Diagram (Swapchain, 2020) [4]

### 4.2. Use Case Description

Use Case Name:   
- Atomic cross-chain swap

Scenario:   
- Two users want to exchange BTC and BTS

Triggering Event:   
- The user submits an exchange order

Actors:   
- User 1 and User 2

Preconditions:   
- Users should be in possession of the cryptocurrency that is desired by the other party
- Users should open a HTLC in their respective Blockchains

Post Conditions:   
- Validating the user
- Hash and time lock conditions should be met

Flow of Events:   
- Submit desired order
- Start a HTLC
- Fund and redeem a swap
- Key pair generator
- Verification process of validity between private and public keys
- Transaction successful or funds are refunded 

Exception Conditions:   
- Network failure
- App crashing
- Too much market volatility

## 5. Architectural Goals and Constraints

There are some key requirements and system constraints that have a significant bearing on the architecture:

- The Swapchain platform should satisfy all requirements set by the AMOS project, i.e. licenses, schedule, tools, etc.
- The BOM should be within a reasonable amount.
- All private information of the users (e.g. private keys) using the application should be processed safely.

## 6. Deployment

This web app is hosted on [Netlify](https://swapchain.netlify.app). Instructions on how to use the CLI can be found in the README of our GitHub repository.

### 6.1. Technology Stack Description

Web app:

- JavaScript, TypeScript, CSS, HTML
- React.js
- Tailwind.css

CLI:

- JavaScript, TypeScript
- node.js

Blockchain Gateway:

- Bitcoin libraries:
  - bitcoinjs-lib [2]
- Bitshare libraries:
  - bitsharesjs

A detailed list of the libraries we use can be found in the BOM.

## 7. Implementation

The implementation diagram is used to visualize the flow of control and the implementation description elaborates further on the processes taking place.

### 7.1. Implementation Diagram

![](/img/Implementation.svg)  
Figure 5: Implementation Diagram (Swapchain, 2020) [4]

### 7.2. Implementation Description

End-User:  
The user interacts with the Swapchain UI without signing-up or authenticating an account. We assume that proposer and accepter already know each other. Next, both exchange partners have to fill out a form to either accept or propose an atomic cross-chain swap. The user initiates the atomic swap by submitting the respective form and therewith opening an ACCS.

System:  
After the system receives the proposal created by the user, a swap request is carried out using an HTLC. Therefore, the signatures are verified so that the private key matches the public key for the swap to take place. As soon as all required conditions are met it relays back and responds to the system to successfully transfer the funds. The involved users will receive an error message if the transaction was unsuccessful. In this case the users will be receiving the refund.

## 8. Size and Performance

The chosen software architecture supports the following requirements:

1. Since the application runs locally, only the chosen blockchain network nodes limit the number of concurrent users.
2. The system shall be able to complete an ACCS transaction within a reasonable time once all HTLC requirements are met. The exact time, however, depends on the miners.

## 9. Quality

The software architecture supports the following quality requirements:

1. The UI of the Swapchain platform will be designed for ease-of-use and shall be appropriate for a computer-literate user community with some knowledge of cryptocurrency technologies.
2. The Swapchain application will be available 24/7. However, it can not be guaranteed that Netlify and even a Blockchain node that is used are never down. This would obviously affect Swapchain's services.

## 10. References

1. Github. (2020, May 2). Github swapchain repository. Retrieved from https://github.com/chronark/swapchain

2. junderw. (2020, May 5). Github bitcoinjs-lib. Retrieved from https://github.com/bitcoinjs/bitcoinjs-lib

3. Martin, R. C. (2020, May 4). The Clean Code Blog. Retrieved from https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

4. Swapchain. (2020, May 4). draw.io. Retrieved from https://www.draw.io/

5. Zipkin, M. (2020, May 3). bcoin. Retrieved from https://bcoin.io/guides/swaps.html
