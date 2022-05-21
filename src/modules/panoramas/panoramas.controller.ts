import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PanoramasService } from './panoramas.service';

@ApiTags('Panoramas')
@Controller('panoramas')
export class PanoramasController {
  constructor(
    private readonly categoriaService: PanoramasService
  ) { }

  // @Auth()
  // @Post()
  // async create(
  //   @Body() dto: CreatePanoramasDto,
  //   @UserLogin() userLogin: UsuariosEntity
  // ) {
  //   let data = await this.categoriaService.create(dto, userLogin);
  //   return {
  //     statusCode: 200,
  //     data,
  //     message: CONST.MESSAGES.COMMON.CREATE_DATA
  //   };
  // }

  // @Auth()
  // @Post('/all')
  // async getAll(
  //   @Body() dto: GetAllDto,
  // ) {
  //   const data = await this.categoriaService.getAll(dto);
  //   let res = {
  //     statusCode: 200,
  //     data: data,
  //     message: ''
  //   }
  //   return res
  // }

  // @Auth()
  // @Get(':id')
  // async getOne(@Param('id') id: number) {
  //   const data = await this.categoriaService.getOne(id);
  //   return {
  //     statusCode: 200,
  //     data,
  //     message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
  //   }
  // }

  // @Auth()
  // @Patch()
  // async update(
  //   @Body() dto: UpdatePanoramasDto,
  //   @UserLogin() userLogin: UsuariosEntity
  // ) {
  //   const data = await this.categoriaService.update(dto, userLogin);
  //   return {
  //     statusCode: 200,
  //     data,
  //     message: CONST.MESSAGES.COMMON.UPDATE_DATA
  //   }
  // }

  // @Auth()
  // @Delete(':id')
  // async delete(
  //   @Param('id') id: number,
  // ) {
  //   const data = await this.categoriaService.delete(id);
  //   return {
  //     statusCode: 200,
  //     data,
  //     message: CONST.MESSAGES.COMMON.DELETE_DATA
  //   }
  // }

  // @Auth()
  // @Post('/image')
  // @UseInterceptors(
  //   FileInterceptor('file'),
  // )
  // async createImage(
  //   @UploadedFile() file,
  //   @Body() dto: CreateImageDto,
  //   @UserLogin() userLogin: UsuariosEntity
  // ) {
  //   const data = await this.categoriaService.createImage(file, dto, userLogin);
  //   return {
  //     statusCode: 200,
  //     data,
  //     message: CONST.MESSAGES.COMMON.CREATE_DATA
  //   };
  // }

  // @Auth()
  // @Post('/image/update')
  // async createImageUpdate(
  //   @Body() dto: UpdateImageDto,
  // ) {
  //   const data = await this.categoriaService.updateImage(dto);
  //   return {
  //     statusCode: 200,
  //     data,
  //     message: CONST.MESSAGES.COMMON.CREATE_DATA
  //   };
  // }

}
