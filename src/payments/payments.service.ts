import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { type Request, type Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripe.secretKey);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items: items.map((item) => ({
        price_data: {
          currency,
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: envs.stripe.successUrl, // where to redirect after successful payment
      cancel_url: envs.stripe.cancelUrl, // where to redirect after cancelled payment
    });

    return session;
  }

  webhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).send('Webhook signature missing');
    }

    let event: Stripe.Event;

    const endpointSecret = envs.stripe.webhookSecret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        endpointSecret,
      );
    } catch (err) {
      const errorMessage =
        err instanceof Stripe.errors.StripeError
          ? err.message
          : 'Unknown error';
      return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }

    // Handle the event
    switch (event.type) {
      case 'charge.succeeded': {
        // When actually the payment is done

        const chargeSucceeded = event.data.object;
        console.log('Charge was successful!');
        console.log(chargeSucceeded);
        console.log('Order paid id: ', chargeSucceeded.metadata.orderId);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({
      ok: true,
      message: 'Webhook received',
    });
  }
}
