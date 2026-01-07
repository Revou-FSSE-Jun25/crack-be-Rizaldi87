import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.repo.create(createUserDto);
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.repo.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
