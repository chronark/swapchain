---
id: architecture
title: Swapchain Software Architecture
sidebar_label: Swapchain Software Architecture
---

## 1. Introduction

Swapchain is a platform to atomically swap Bitcoins and Bitshares. It caters to the need of users who want to carry out OTC (over-the-counter) transactions between the Bitcoin and the Bitshare blockchains. The platform can help its users to identify potential swap offers from the existing orderbook, submit the desired swap orders, and perform a Hash Time-Locked Contract to safely carry out the swap. Furthermore, it provides the functionality of a simple user interface to track the transactions made by the user. The use of an atomic cross-chain swap helps avoiding counterparty risks and high fees charged by other intermediaries. [5]

### 1.1 Purpose

This document provides a comprehensive architectural overview of the Swapchain platform, using a use-case diagram and an architectural representation to explain different aspects of the platform. It is intended to capture and convey the significant architectural decisions which have been made for the platform design.

### 1.2 Scope

The Swapchain platform is being developed by a group of students from Friedrich-Alexander University Erlangen to support cross-chain atomic swaps as part of an AMOS project. This software architecture document applies to each static and dynamic aspect of the platform. It includes an architectural model to explain the different processes that happen. Furthermore, it also discusses deployment and implementation issues of the Swapchain platform.

### 1.3 Definitions, Acronyms, Abbreviations

AMOS - Agile methods and Open-Source Software  
ACCS - Atomic cross-chain swaps  
HTLC - Hash time locked contract  
ECDSA - Elliptic Curve Digital Signature Algorithm  
BTC - Bitcoin  
BTS - Bitshare  
OTC - Over the counter  
REST - Representational State Transfer  
API - Application Programming Interface  
UI - User Interface  
BOM - Bill of materials  
GCE - Google Compute Engine  
SaaS - Software as a Service

### 1.4 Overview

The report will present a detailed analysis of the architecture of a platform enabling ACCS between BTC and BTS. Initial sections of the document cover the architectural goals and constraints, use case realizations, and architectural representation. The later sections cover the specific details of the implementation and deployment of the platform. Furthermore, the document also describes the performance and quality.

## 2. Architectural Represantition

Swapchain offers a web application that follows the Clean architecture pattern. Main reason to use this pattern is to separate functions into layers thus improve the maintainability and reusability. Figure 1 visualizes the Clean Architecture by using color-coded schemes.

![](./docs/static/img/CleanArchitecture.jpg)
Figure 1: The Clean Architecture (Martin, 2020) [3]

So, in the context of our application:

1. Yellow Layer: This layer is highly abstract, general, and thus very stable. Hence, in this case, the entity is the atomic swap of cryptocurrencies.
2. Red Layer: This layer contains the Use-Case, which is the swapping of BTC to BTS and vice versa.
3. Green Layer: This layer is used to separate the Red layer from the Blue layer. It has the framework specific code which is to be used by the application.
4. Blue Layer: This layer (framework and drivers) contains the graphical UI, API, and the database.

| Clean Architecture Layers | Entities                                    | Use Cases                                | Controllers, Gateways, Presenters                           | UI, Web, Devices, DB              |
| ------------------------- | ------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------- | --------------------------------- |
| General Description       | Main features of the application            | Application of the main ideas            | Encapsulates framework-specific code                        | Contains frameworks and tools     |
| Swapchain Specific        | Atomic cross-chain swap of cryptocurrencies | Cross-chain swaps, cross-consensus swaps | Interaction, libraries, data-structures from UI to use case | Orderbook, database, APIs, Web UI |

A significant feature of this architecture is the flow of dependencies, which can be seen by the arrows moving in from the blue layer to the yellow layer in figure 1. This signifies that an outer layer can depend on an inner layer, but an inner layer cannot depend on an outer layer. The things that are most likely to change are kept on the outer layers and the things are less likely to change are kept on the inner most layers, helping the application stand the test of time. This makes the inner layers much more stable than the outer layers thus, the tools used to build the application can be modified easily (blue layer) but the core concepts and ideas behind the application are less likely to change (yellow layer). [3]

## 3. Logical and Code Component Overview

The logical view of the Swapchain Web Application is comprised of 3 main components: User Interface, HTLC, and Verification.

UI:
The UI contains an interface for the user authentication as well as a database to store orderbook entries.

HTLC:
The HTLC contains several sub-components. A crucial part here, is the secret and hash generator that first generates a random secret that is then cryptographically hashed. In order to further conduct the swap, a hash lock sub-component and a time lock sub-component need to be set up. The hash lock accesses the hash generator to retrieve the hashed password, while the time lock cooperates with the refund process, so as soon as the time lock expires, the refund process can be initialized.

Verification:
The Verification contains the signature verification sub-component which is consulted to verify the swap partners’ signatures. This sub-component comprises of a sign-transaction interface which locally compares the private key to the public key in the browser. If the verification is successful, the swap is executed. If not, the verification fails, and the refund process is initiated.

### 3.1. UML Diagram

![](./docs/static/img/UML.png)
Figure 2: UML Diagram (Swapchain, 2020) [4]

## 4. Use Case

The use case diagram is used to visualize the Swapchain application and its actors.

### 4.1. Use Case Diagram

![](./docs/static/img/UseCase.png)  
Figure 3: Use Case Diagram (Swapchain, 2020) [4]

### 4.2. Use Case Description

| Use Case Name           | Scenario                               | Triggering Event                   | Actors            | Related Use Case | Preconditions                                                                                                                                       | Post Conditions                                                     | Flow of Events                                                                                                                                                                                                           | Exception Conditions                                          |
| ----------------------- | -------------------------------------- | ---------------------------------- | ----------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Atomic cross-chain swap | Two users want to exchange BTC and BTS | The user submits an exchange order | User 1 and User 2 | None             | - Users should be in possession of the cryptocurrency that is desired by the other party - Users should open a HTLC in their respective Blockchains | - Validating the user - Hash and time lock conditions should be met | - Check order book - Submit desired order - Start a HTLC - Fund and redeem a swap - Key pair generator - Verification process of validity between private and public keys - Transaction successful or funds are refunded | - Network failure - App crashing - Too much market volatility |

## 5. Architectural Goals and Constraints

There are some key requirements and system constraints that have a significant bearing on the architecture. They are:

- The Swapchain platform should satisfy all requirements set by the AMOS project, i.e. licenses, schedule, tools, etc.
- The BOM should be within a reasonable amount.
- Swapchain platform should be accessible with local and remote PCs.
- All private and public information of the clients using the platform should be secured safely.
- The Swapchain platform will be implemented as a client-server system. The client portion resides on PCs and the server portion must operate on the APIs and databases used.

## 6. Deployment

This web application is a system which is hosted in an API. The database will be hosted by ChainSquad once the software is delivered. Atomic transactions are conducted in the backend, so that the client computer does not have to spend much of CPU power. The user login and the orderbook will be executed in the frontend, so the client computer will need a decent level of performance.

### 6.1. Deployment Diagram

Figure 4 follows the Clean Architecture principle. The frontend and database depict the outer blue layer. The orderbook and Blockchain gateway function as controllers and hence, begin the green layer. The HTLC blocks below the Blockchain gateway depict the red layer as they are use cases. The ACCS itself depicts the yellow layer at the core of the Clean Architecture.

![](./docs/static/img/Deployment.png)
Figure 4: Deployment Diagram (Swapchain, 2020) [4]

### 6.2. Technology Stack Description

All services will be running in docker containers at first and orchestrated by docker-compose for simplicity sake. As Swapchain gets closer to mid-term release, the project team will be moving to a Kubernetes deployment on GCE. [1][2]

Frontend:

- JavaScript, CSS, HTML
- React.js
- Nginx container

Backend:

- Microservice architecture
- TypeScript, Node.js, Express
- Communication is JSON over HTTP
- Docker / Kubernetes

Orderbook:

- Node.js express REST API
- External API to get exchange rates

Blockchain Gateway:

- Bitcoin libraries:
  - Bcoin (Zipkin, 2020)
  - Bitcoinjs (junderw, 2020)
- Bitshare libraries:
  - Bitsharejs
- To ensure Clean Architecture as the project might get expanded further, this will be serving as a mechanism to separate the blockchain logic from the orderbook:
  - Responsible for issuing the creation of HTLCs on the requested blockchains
  - Can also house the key generation and hashing modules as they are required for all chains

HTLC/XXX:

- Creates the HTLC on its own blockchain

Database:

- Postgres, MySQL

Logging:

- To be decided by ChainSquad if it gets outsourced to a dedicated SaaS

## 7. Implementation

The implementation diagram is used to visualize the flow of control and the implementation description elaborates further on the processes taking place.

### 7.1. Implementation Diagram

![](./docs/static/img/Implementation.png)
Figure 5: Implementation Diagram (Swapchain, 2020) [4]

### 7.2. Implementation Description

End-User:
The user interacts with Swapchain’s UI by authenticating his/her account. Once logged in, the user can look for swap offers in the orderbook (e.g. exchange BTC for BTS). In case a potential offer is found, the user initiates the atomic swap by submitting an order from the orderbook.

System:
After the system receives the order submitted by the user a swap request is carried out using a HTLC. For that an API verifies the signatures and ensures that the private key matches the public key for the swap to take place. As soon as all required conditions are met it relays back and responds to the system to successfully transfer the funds. The involved users will receive a notification if the transaction was successful or not. In case the transaction fails, the users will receive a notification that they will be receiving the refund.

## 8. Size and Performance

The chosen software architecture supports the following requirements:

1. The system shall support two simultaneous users against the central database at any given time.
2. The system shall be able to complete an ACCS transaction within 2 minutes once all HTLC requirements are met.

## 9. Quality

The software architecture supports the following quality requirements:

1. The UI will be a web application.
2. The UI of the Swapchain platform will be designed for ease-of-use and shall be appropriate for a computer-literate user community with some knowledge of cryptocurrency exchanges.
3. Each feature of the Swapchain platform is documented in a subdomain of Github (Github, 2020) by following this link: https://chronark.github.io/swapchain [1]
4. The Swapchain platform will be available 24 hours a day, 7 days a week.

## 10. References

1. Github. (2020, May 2). Github swapchain repository. Retrieved from https://github.com/chronark/swapchain

2. junderw. (2020, May 5). Github bitcoinjs-lib. Retrieved from https://github.com/bitcoinjs/bitcoinjs-lib

3. Martin, R. C. (2020, May 4). The Clean Code Blog. Retrieved from https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

4. Swapchain. (2020, May 4). draw.io. Retrieved from https://www.draw.io/

5. Zipkin, M. (2020, May 3). bcoin. Retrieved from https://bcoin.io/guides/swaps.html
