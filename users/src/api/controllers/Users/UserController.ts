import {
  Param,
  Get,
  JsonController,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  UseBefore,
  QueryParams,
  Req,
} from 'routing-controllers';
import { UserService } from '@api/services/Users/UserService';
import { Service } from 'typedi';
import { UserCreateRequest } from '@api/requests/Users/UserCreateRequest';
import { ControllerBase } from '@base/abstracts/ControllerBase';
import { UserUpdateRequest } from '@api/requests/Users/UserUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController()
@UseBefore(AuthCheck)
export class UserController extends ControllerBase {
  public constructor(private userService: UserService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.userService.getAll(resourceOptions);
  }

  @Get('/verify/token')
  public async verifyToken(@Req() req: any) {
    return await req.loggedUser;
  }

  @Get('/:id')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.userService.findOneById(id, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() user: UserCreateRequest) {
    return await this.userService.create(user);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() user: UserUpdateRequest) {
    return await this.userService.updateOneById(id, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.userService.deleteOneById(id);
  }
}
