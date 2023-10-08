import got from 'got';
import db from '../../config/dbConfig.js';

const Gateway = db.gateways;
const Setting = db.settings;

export async function paystackPayment(data, user) {
  try {
    const gateway = await Gateway.findOne({ where: { value: 'paystack' } });
    const apiUrl = await Setting.findOne({ where: { value: 'apiUrl' } });

    const apiData = await got({
      method: 'POST',
      uri: 'https://api.paystack.co/transaction/initialize',
      json: true,
      body: {
        reference: `${data.id}`,
        amount: data.amount * 100,
        email: user.email,
        currency: data.currency,
        callback_url: `${apiUrl.param1}/payments/paystack`,
      },
      headers: {
        Authorization: `Bearer ${gateway.apiKey}`,
      },
    });
    return apiData.data.authorization_url;
  } catch (err) {
    return err;
  }
}
