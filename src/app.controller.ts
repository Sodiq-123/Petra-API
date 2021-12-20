import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  home() {
    return this.appService.home();
  }
  @Get('/docs')
  getDocs(@Res() res: any) {
    return res.redirect(
      'https://documenter.getpostman.com/view/14459384/UVRAKTHJ',
    );
  }
}
