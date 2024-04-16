# Cryptocurrency Wallet and Exchange System Backend API Documentation

This documentation provides a comprehensive guide to the backend API developed for a cryptocurrency wallet and exchange system. The API is built using Node.js, Express.js, Sequelize ORM, and MySQL.

## Overview

The cryptocurrency wallet and exchange system backend API serves as the foundation for managing various aspects of a cryptocurrency, exchange platform. It enables functionalities such as user authentication, currency management, deposit and withdrawal processing, exchange operations, KYC verification, and more. The API is designed to be scalable, secure, and easy to integrate with frontend applications.

## Geting Started

### Installation

To set up the backend API locally, follow these steps:

1. clone the repository:

```bash
git clone <repository-url>
```

2. Install Dependencies

```bash
cd cryptocurrency-wallet-api
npm install
```

3. Set Up Environment Variables:

- Copy the .env.example file to .env.
- Modify the .env file to include necessary configurations such as database connection details, API keys, etc.

4. Database Setup:

- Ensure MySQL is installed and running.
- Create a MySQL database for the application.
- Update the .env file with the database credentials.

5. Start the Server:
   Run the code below to initial the database and start the server

```bash
yarn start
```

6. Access the API:
   The API will be accessible at http://localhost:3000 by default.

## Folder Structure

```
cryptocurrency-wallet-api/
│
├── src/ # Source code
│ ├── config/ # Configuration files
│ │ ├── cryptoConfig.js
│ │ ├── dbConfig.js # Application database configuration
│ │ ├── fiatConfig.js
│ │ ├── gatewayConfig.js
│ │ ├── mailConfig.js
│ │ └── multerConfig.js
│ │
│ ├── controllers/ # Route controllers
│ │ ├── authController.js
│ │ ├── currencyController.js
│ │ ├── depositController.js
│ │ ├── exchangeController.js
│ │ ├── kycController.js
│ │ ├── linkedController.js
│ │ ├── mailGenController.js
│ │ ├── merchantController.js
│ │ ├── methodController.js
│ │ ├── pageController.js
│ │ ├── payController.js
│ │ ├── paymentController.js
│ │ ├── requestController.js
│ │ ├── settingsController.js
│ │ ├── transferController.js
│ │ ├── userController.js
│ │ ├── walletController.js
│ │ └── withdrawController.js
│ │
│ ├── middlewares/ # Custom middleware functions
│ │ └── authMiddleware.js
│ │
│ ├── models/ # Sequelize models
│ │ ├── Currency.js
│ │ ├── Deposit.js
│ │ ├── Exchange.js
│ │ ├── KYC.js
│ │ ├── LinkedAccount.js
│ │ ├── Merchant.js
│ │ ├── PaymentMethod.js
│ │ ├── Request.js
│ │ ├── Transaction.js
│ │ ├── User.js
│ │ └── Wallet.js
│ │
│ ├── routes/ # Route definitions
│ │ ├── authRoute.js
│ │ ├── currencyRoute.js
│ │ ├── depositRoute.js
│ │ ├── exchangeRoute.js
│ │ ├── kycRoute.js
│ │ ├── linkedRoute.js
│ │ ├── mailGenRoute.js
│ │ ├── merchantRoute.js
│ │ ├── methodRoute.js
│ │ ├── pageRoute.js
│ │ ├── payRoute.js
│ │ ├── paymentRoute.js
│ │ ├── requestRoute.js
│ │ ├── settingsRoute.js
│ │ ├── transferRoute.js
│ │ ├── userRoute.js
│ │ ├── walletRoute.js
│ │ └── withdrawRoute.js
│ │
│ ├── utils/ # Utility functions
│ │ ├── validation.js
│ │ └── logger.js
│ │
│ └── app.js # Express application setup
│
├── .env.example # Example environment variables file
├── package.json # Node.js dependencies and scripts
└── README.md # Project README file

```

### Conclusion

This documentation provides a comprehensive guide to installing and understanding the folder structure of the cryptocurrency wallet and exchange system backend API. For detailed usage instructions and implementation details, refer to the respective route controllers, models, and configuration files in the codebase
