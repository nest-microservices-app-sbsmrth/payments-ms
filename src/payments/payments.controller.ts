import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { type Request, type Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post('create-session')
  @MessagePattern('create.payment.session') // '.' to allow NATS wildcard subscriptions later if needed
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
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
  webhook(@Req() req: Request, @Res() res: Response) {
    // URL that stripe will call on payment events
    return this.paymentsService.webhook(req, res);
  }
}
