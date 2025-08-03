import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-session')
  createPaymentSession() {
    return {
      ok: true,
      message: 'Payment session created successfully',
    };
  }

  @Get('success')
  success() {
    // URL that stripe will call after a successful payment
    return {
      ok: true,
      message: 'Payment successful',
    };
  }

  @Get('cancelled')
  cancelled() {
    // URL that stripe will call after a cancelled payment
    return {
      ok: true,
      message: 'Payment cancelled',
    };
  }

  @Post('webhook')
  webhook() {
    // URL that stripe will call on payment events
    return {
      ok: true,
      message: 'Webhook received',
    };
  }
}
