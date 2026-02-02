import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { State } from "../entities/state.entity";
import { CreateStateDto, UpdateStateDto } from "../dto/state.dto";

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
  ) {}

  async create(createStateDto: CreateStateDto) {
    try {
      const state = this.stateRepo.create(createStateDto);
      return await this.stateRepo.save(state);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException(
          `El estado "${createStateDto.name}" ya existe`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return await this.stateRepo.find({ order: { id: "ASC" } });
  }

  async findOne(id: number) {
    const state = await this.stateRepo.findOneBy({ id });
    if (!state)
      throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    return state;
  }

  async update(id: number, updateStateDto: UpdateStateDto) {
    const state = await this.findOne(id);
    const updatedState = Object.assign(state, updateStateDto);
    return await this.stateRepo.save(updatedState);
  }

  async remove(id: number) {
    const state = await this.findOne(id);
    return await this.stateRepo.remove(state);
  }
}
