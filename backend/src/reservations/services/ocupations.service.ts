import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ocupation } from "../entities/ocupation.entity";
import { CreateOcupationDto, UpdateOcupationDto } from "../dto/ocupation.dto";

@Injectable()
export class OcupationsService {
  constructor(
    @InjectRepository(Ocupation)
    private readonly repo: Repository<Ocupation>,
  ) {}

  async create(dto: CreateOcupationDto) {
    try {
      const newOcupation = this.repo.create({
        ...dto,
        reservation: { id: dto.reservationId } as any,
      });
      return await this.repo.save(newOcupation);
    } catch (error) {
      if (error.code === "23505") {
        // Código de error de PostgreSQL para Unique Violation
        throw new ConflictException(
          "Ya existe una ocupación para esta reserva en esa fecha y hora.",
        );
      }
      throw error;
    }
  }

  async findAll() {
    return await this.repo.find({
      relations: ["reservation"],
      order: { date: "ASC", startHour: "ASC" },
    });
  }

  async findByReservation(reservationId: number) {
    return await this.repo.find({
      where: { reservation: { id: reservationId } },
    });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item)
      throw new NotFoundException(`Ocupación con ID ${id} no encontrada`);
    return item;
  }

  async update(id: number, dto: UpdateOcupationDto) {
    const item = await this.findOne(id);
    if (dto.reservationId) {
      item.reservation = { id: dto.reservationId } as any;
    }
    this.repo.merge(item, dto);
    return await this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return await this.repo.remove(item);
  }
}
