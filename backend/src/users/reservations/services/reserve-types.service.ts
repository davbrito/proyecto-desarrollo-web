import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReserveType } from "../entities/reserve_type.entity.js";
import {
  CreateReserveTypeDto,
  UpdateReserveTypeDto,
} from "../dto/reserve-type.dto.js";

@Injectable()
export class ReserveTypesService {
  constructor(
    @InjectRepository(ReserveType)
    private readonly repo: Repository<ReserveType>,
  ) {}

  async create(dto: CreateReserveTypeDto) {
    const newType = this.repo.create(dto);
    return await this.repo.save(newType);
  }

  async findAll() {
    return await this.repo.find({ order: { priority: "DESC" } });
  }

  async findOne(id: number) {
    const type = await this.repo.findOneBy({ id });
    if (!type)
      throw new NotFoundException(`Tipo de reserva con ID ${id} no encontrado`);
    return type;
  }

  async update(id: number, dto: UpdateReserveTypeDto) {
    const type = await this.findOne(id);
    this.repo.merge(type, dto);
    return await this.repo.save(type);
  }

  async remove(id: number) {
    const type = await this.findOne(id);
    return await this.repo.remove(type);
  }
}
