import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Class } from "../entities/class.entity.js";
import { CreateClassDto, UpdateClassDto } from "../dto/class.dto.js";

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  async create(dto: CreateClassDto) {
    try {
      const newClass = this.classRepo.create({
        professor: dto.professor,
        reservation: { id: dto.reservationId } as any,
      });
      return await this.classRepo.save(newClass);
    } catch (error) {
      // Error 23505 es violación de unicidad (ya existe una clase para esa reserva)
      if (error.code === "23505") {
        throw new ConflictException("Esta reserva ya tiene una clase asignada");
      }
      throw error;
    }
  }

  async findAll() {
    return await this.classRepo.find({
      relations: ["reservation"],
    });
  }

  async findOne(id: number) {
    const cls = await this.classRepo.findOne({
      where: { id },
      relations: ["reservation"],
    });
    if (!cls) throw new NotFoundException(`Clase con ID ${id} no encontrada`);
    return cls;
  }

  async update(id: number, dto: UpdateClassDto) {
    const cls = await this.findOne(id);
    if (dto.reservationId) {
      cls.reservation = { id: dto.reservationId } as any;
    }
    this.classRepo.merge(cls, dto);
    return await this.classRepo.save(cls);
  }

  async remove(id: number) {
    const cls = await this.findOne(id);
    return await this.classRepo.remove(cls);
  }
}
