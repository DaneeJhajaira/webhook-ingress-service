import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { WebhookService } from '../services/webhook.service';

@Controller('webhook/meta')
export class WebhookController {
  constructor(
    private readonly configService: ConfigService,
    private readonly webhookService: WebhookService,
  ) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const expectedToken =
      this.configService.get<string>('META_VERIFY_TOKEN') ?? '';

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  }

  @Post()
  async receiveWebhook(@Body() body: any, @Res() res: Response) {
    await this.webhookService.processWebhook(body);
    return res.sendStatus(200);
  }
}