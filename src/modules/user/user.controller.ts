import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Response } from '../base.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    try {
      const user = await this.userService.create(createUserDto);
      return { success: true, data: user };
    } catch (error) {
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Response<User[]>> {
    const users = await this.userService.findAll();
    return { success: true, data: users };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<User>> {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);
    return { success: true, data: user };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Response<User>> {
    try {
      const updatedUser = await this.userService.update(+id, updateUserDto);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return { success: true, data: updatedUser };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response> {
    try {
      const deleted = await this.userService.delete(+id);
      if (!deleted) throw new NotFoundException(`User with ID ${id} not found.`);
      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
