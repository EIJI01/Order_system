import { Body, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { Response } from './base.interface';
import { BaseService } from './base.service';
import { DeepPartial } from 'typeorm';

export class BaseController<C extends DeepPartial<T>, U extends DeepPartial<T>, T> {
  constructor(private readonly service: BaseService<T>) {}

  @Post()
  async create(@Body() createUserDto: C): Promise<Response<T>> {
    try {
      const result = await this.service.create(createUserDto);
      return { success: true, data: result };
    } catch (error) {
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Response<T[]>> {
    const results = await this.service.findAll();
    return { success: true, data: results };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<T>> {
    const result = await this.service.findOne(+id);
    if (!result) throw new NotFoundException(`${Text.name} with ${id} not found.`);
    return { success: true, data: result };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: U): Promise<Response<T>> {
    try {
      const updatedUser = await this.service.update(+id, updateUserDto);
      if (!updatedUser) {
        throw new NotFoundException(`${Text.name} with ID ${id} not found.`);
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
      const deleted = await this.service.delete(+id);
      if (!deleted) throw new NotFoundException(`${Text.name} with ID ${id} not found.`);
      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
