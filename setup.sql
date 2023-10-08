INSERT INTO `currencies` (`id`, `name`, `symbol`, `icon`, `rateUsd`, `ratefromApi`, `crypto`, `metadata`, `active`, `createdAt`, `updatedAt`) VALUES
(1, 'US Dollar', 'USD', NULL, 1, 1, 0, NULL, 1, '2023-08-26 18:34:45', '2023-08-26 18:34:45');

INSERT INTO `gateways` (`id`, `name`, `value`, `apiKey`, `secretKey`, `email`, `isCrypto`, `active`, `isExchangePayment`, `ex1`, `ex2`, `createdAt`, `updatedAt`) VALUES
(1, 'Mollie', 'mollie', NULL, NULL, NULL, 0, 0, 0, NULL, NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(2, 'Coinbase', 'coinbase', NULL, NULL, NULL, 1, 0, 0, NULL, NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(3, 'Coin Payments', 'coinpayments', NULL, NULL, NULL, 1, 0, 0, NULL, NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(4, 'Paypal', 'paypal', NULL, NULL, NULL, 0, 0, 0, 'live', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(5, 'Stripe', 'stripe', NULL, NULL, NULL, 0, 0, 0, NULL, NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(6, 'Coingate', 'coingate', NULL, NULL, NULL, 1, 0, 0, 'live', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(7, 'Paystack', 'paystack', NULL, NULL, NULL, 0, 0, 0, NULL, NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(8, 'VoguePay', 'voguepay', NULL, NULL, NULL, 0, 0, 0, NULL, NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45');

INSERT INTO `pages` (`id`, `type`, `name`, `slug`, `content`, `createdAt`, `updatedAt`) VALUES
(1, 'landing', 'Home', 'home', '[]', '2023-08-26 18:34:45', '2023-08-26 18:34:45');

INSERT INTO `settings` (`id`, `value`, `param1`, `param2`, `createdAt`, `updatedAt`) VALUES
(1, 'refferal', '10', 'USD', '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(2, 'site', 'Walleyum', 'walleyum@tdevs.co', '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(3, 'appUrl', 'https://walleyum.tdevs.co', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(4, 'apiUrl', 'https://walleyum.tdevs.co/api', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(5, 'freecurrencyapi', NULL, NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(6, 'adjustments', '2.5', '0', '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(7, 'mainmenu', '[]', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(8, 'footermenu', '[]', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(9, 'tagline', 'Wallet, Exchanger, Cryptocurrency', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(10, 'logo', NULL, NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(11, 'services', '[]', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(12, 'solutions', '[]', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(13, 'work', '[]', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45'),
(14, 'faq', '[]', NULL, '2023-08-26 18:34:45', '2023-08-26 18:34:45');