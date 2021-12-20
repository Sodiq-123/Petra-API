import { Injectable, Redirect } from '@nestjs/common';

@Injectable()
export class AppService {
  home() {
    return 'Welcome to Petra API, access the docs at /docs'
  }
  docs() {
    return Redirect(
      'https://documenter.getpostman.com/view/14459384/UVRAKTHJ',
      200,
    );
  }
}
