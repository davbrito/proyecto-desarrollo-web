import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { CreateEventDto, UpdateEventDto } from "../dto/event.dto";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async create(dto: CreateEventDto) {
    try {
      const newEvent = this.eventRepo.create({
        stimatedAssistants: dto.stimatedAssistants,
        reservation: { id: dto.reservationId } as any,
      });
      return await this.eventRepo.save(newEvent);
    } catch (error) {
      // Violación de unicidad: la reserva ya tiene un evento
      if (error.code === "23505") {
        throw new ConflictException("Esta reserva ya tiene un evento asignado");
      }
      throw error;
    }
  }

  async findAll() {
    return await this.eventRepo.find({
      relations: ["reservation"],
    });
  }

  async findOne(id: number) {
    const eventItem = await this.eventRepo.findOne({
      where: { id },
      relations: ["reservation"],
    });
    if (!eventItem)
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    return eventItem;
  }

  async update(id: number, dto: UpdateEventDto) {
    const eventItem = await this.findOne(id);
    if (dto.reservationId) {
      eventItem.reservation = { id: dto.reservationId } as any;
    }
    this.eventRepo.merge(eventItem, dto);
    return await this.eventRepo.save(eventItem);
  }

  async remove(id: number) {
    const eventItem = await this.findOne(id);
    return await this.eventRepo.remove(eventItem);
  }
}
