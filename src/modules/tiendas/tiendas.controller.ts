import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { isEmptyUndefined } from '../../common/helpers';
import { URLPAGE } from '../../config';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  AsignarCComercialesDto,
  CreateImageDto,
  CreateTiendasDto,
  GetAllDto,
  UpdateImageDto,
  UpdateTiendasDto,
} from './dto';
import { TiendasService } from './tiendas.service';

const TIENDAS = 'tiendas'
@ApiTags('Tiendas')
@Controller(TIENDAS)
export class TiendasController {
  constructor(
    private readonly tiendasService: TiendasService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateTiendasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.tiendasService.create(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/all')
  async getAll(
    @Body() dto: GetAllDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.tiendasService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${TIENDAS}/all`,
    });
    let res = {
      statusCode: HttpStatus.OK,
      data: data.items,
      meta: data.meta,
      links: data.links,
      message: ''
    }
    return res
  }

  @Auth()
  @Post('/publico')
  async getPublico(
    @Body() dto: GetAllDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.tiendasService.getPublico(dto, {
      page,
      limit,
      route: `${URLPAGE}/${TIENDAS}/publico`,
    });
    let res = {
      statusCode: HttpStatus.OK,
      data: data.items,
      meta: data.meta,
      links: data.links,
      message: ''
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.tiendasService.getOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateTiendasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.tiendasService.update(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.tiendasService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

  @Auth()
  @Post('/image')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async createImage(
    @UploadedFile() file,
    @Body() dto: CreateImageDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.tiendasService.createImage(file, dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/image/update')
  async createImageUpdate(
    @Body() dto: UpdateImageDto,
  ) {
    const data = await this.tiendasService.updateImage(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/galeria')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async createGaleria(
    @UploadedFile() file,
    @Body() dto: CreateImageDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.tiendasService.createImage(file, dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/galeria/delete')
  async createGaleriaDel(
    @Body() dto: CreateImageDto,
  ) {
    const data = await this.tiendasService.deleteGaleria(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: 'Se ha eliminado la imagen correctamente'
    };
  }

  @Auth()
  @Post('/galeria/update')
  async createGaleriaUpdate(
    @Body() dto: UpdateImageDto,
  ) {
    const data = await this.tiendasService.updateGaleria(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: 'La imagén se ha actualizado correctamente'
    };
  }

  @Auth()
  @Post('/apertura')
  async actualizarApertura(
    @Body() dto: GetAllDto,
  ) {
    const data = await this.tiendasService.actualizarApertura(dto);
    let res = {
      statusCode: HttpStatus.OK,
      data: data,
      message: 'Se ha actualizado la apertura de la Tienda'
    }
    return res
  }

  @Auth()
  @Post('/asignarCComerciales')
  async asignarCComerciales(
    @Body() dto: AsignarCComercialesDto,
  ) {
    let data = await this.tiendasService.asignarCComerciales(dto);
    return {
      statusCode: HttpStatus.OK,
      data: data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get(':id/ccomerciales')
  async getCComerciales(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.tiendasService.getCComerciales(id, {
      page,
      limit,
      route: `${URLPAGE}/${TIENDAS}/${id}/ccomerciales`,
    });
    let res = {
      statusCode: HttpStatus.OK,
      data: data.items,
      meta: data.meta,
      links: data.links,
      message: ''
    }
    return res
  }

}
