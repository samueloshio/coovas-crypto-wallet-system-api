import { createMollieClient } from '@mollie/api-client';
import db from '../../config/dbConfig.js';

const Gateway = db.gateways;
const Setting = db.settings;

export async function molliePayment(value, id, currency) {
  try {
    const data = await Gateway.findOne({ where: { value: 'mollie' } });
    const appUrl = await Setting.findOne({ where: { value: 'appUrl' } });
    const apiUrl = await Setting.findOne({ where: { value: 'apiUrl' } });
    const mollieClient = createMollieClient({ apiKey: data.apiKey });
    const payment = await mollieClient.payments.create({
      amount: {
        value: value.toFixed(2),
        currency,
      },
      metadata: { id },
      description: 'Deposit Request',
      redirectUrl: `${appUrl.param1}/add-money?status=success`,
      webhookUrl: `${apiUrl.param1}/payments/mollie`,
    });
    return payment;
  } catch (err) {
    return err;
  }
}
