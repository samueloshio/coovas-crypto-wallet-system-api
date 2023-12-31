import stripe from 'stripe';
import dollarsToCents from 'dollars-to-cents';
import db from '../../config/dbConfig.js';

const Gateway = db.gateways;
const Setting = db.settings;

export async function stripePayment(value, id, currency) {
  try {
    const data = await Gateway.findOne({ where: { value: 'stripe' } });
    const appUrl = await Setting.findOne({ where: { value: 'appUrl' } });

    const stripeInit = stripe(data.secretKey);

    const session = await stripeInit.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Deposit Request #${id}`,
            },
            unit_amount: dollarsToCents(value),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: { depositId: id },
      success_url: `${appUrl.param1}/add-money?status=success`,
      cancel_url: `${appUrl.param1}/add-money?status=failed`,
    });
    return session.url;
  } catch (err) {
    return err;
  }
}
