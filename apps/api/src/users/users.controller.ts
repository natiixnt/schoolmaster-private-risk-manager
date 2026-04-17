import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@schoolmaster/core';

// Hierarchia rol - nizszy index = wyzsze uprawnienia
const ROLE_RANK: Record<UserRole, number> = {
  [UserRole.SUPERADMIN]: 0,
  [UserRole.DIRECTOR]: 1,
  [UserRole.SCHOOL_ADMIN]: 2,
  [UserRole.COUNSELOR]: 3,
  [UserRole.TEACHER]: 4,
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SCHOOL_ADMIN, UserRole.DIRECTOR, UserRole.SUPERADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(@CurrentUser() user: AuthRequestUser) {
    return this.usersService.listUsersForSchool(user.schoolId);
  }

  @Post()
  create(@CurrentUser() user: AuthRequestUser, @Body() dto: CreateUserDto) {
    // Nie mozna utworzyc uzytkownika z wyzsza rola niz wlasna
    if (ROLE_RANK[dto.role] < ROLE_RANK[user.role]) {
      throw new ForbiddenException('Nie mozna nadac roli wyzszej niz wlasna');
    }
    return this.usersService.createUser(user.schoolId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthRequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    // Nie mozna nadac roli wyzszej niz wlasna
    if (dto.role !== undefined && ROLE_RANK[dto.role] < ROLE_RANK[user.role]) {
      throw new ForbiddenException('Nie mozna nadac roli wyzszej niz wlasna');
    }
    return this.usersService.updateUser(user.schoolId, id, dto);
  }
}
