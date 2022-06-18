import {
  Controller,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '../../common/decorators';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashbard - Panel de control')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dasboardService: DashboardService
  ) { }

  @Auth()
  @Get('/admin')
  async getAdmin() {
    const data = await this.dasboardService.getAdmin();
    return {
      statusCode: 200,
      data,
      message: ''
    }
  }

}
