import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './src/config/dbConfig.js';

// IMPORT MIDDLEWARES
import authRoutes from './src/routes/authRoute.js';
import settingsRoutes from './src/routes/settingsRoute.js';
import userRoutes from './src/routes/userRoute.js';
import withdrawRoutes from './src/routes/withdrawRoute.js';
import depositRoutes from './src/routes/depositRoute.js';
import currencyRoutes from './src/routes/currencyRoute.js';
import exchangeRoutes from './src/routes/exchangeRoute.js';
import kycRoutes from './src/routes/kycRoute.js';
import methodRoutes from './src/routes/methodRoute.js';
import linkedRoutes from './src/routes/linkedRoute.js';
import transferRoutes from './src/routes/transferRoute.js';
import paymentRoutes from './src/routes/paymentRoute.js';
import walletRoutes from './src/routes/walletRoute.js';
import merchantRoutes from './src/routes/merchantRoute.js';
import requestRoutes from './src/routes/requestRoute.js';
import payRoutes from './src/routes/payRoute.js';
import pageRoutes from './src/routes/pageRoute.js';
import mailGenRoutes from './src/routes/mailGenRoute.js';

const server = express();
dotenv.config();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(morgan('tiny'));
server.use(express.text());
server.use(cookieParser());
server.use(cors({ origin: true, credentials: true }));
server.use('/public', express.static('public'));
server.disable('x-powered-by'); //less hacker know about our stack

server.get('/', (req, res) => {
  res.send('Hello First Request');
});

// MIDDLEWARES

server.use('/', authRoutes);
server.use('/', settingsRoutes);
server.use('/', userRoutes);
server.use('/', withdrawRoutes);
server.use('/', depositRoutes);
server.use('/', transferRoutes);
server.use('/', paymentRoutes);
server.use('/', currencyRoutes);
server.use('/', exchangeRoutes);
server.use('/', walletRoutes);
server.use('/', kycRoutes);
server.use('/', methodRoutes);
server.use('/', linkedRoutes);
server.use('/', merchantRoutes);
server.use('/', requestRoutes);
server.use('/', payRoutes);
server.use('/', pageRoutes);
server.use('/', mailGenRoutes);

const port = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on ${port}`);
  });
});
