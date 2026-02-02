import { Test, TestingModule } from "@nestjs/testing";
import { LaboratoriesService } from "./laboratories.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Laboratory } from "./entities/laboratory.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

describe("LaboratoriesService", () => {
  let service: LaboratoriesService;
  let repository: Repository<Laboratory>;

  // Mock del repositorio
  const mockLaboratoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LaboratoriesService,
        {
          provide: getRepositoryToken(Laboratory),
          useValue: mockLaboratoryRepository,
        },
      ],
    }).compile();

    service = module.get<LaboratoriesService>(LaboratoriesService);
    repository = module.get<Repository<Laboratory>>(
      getRepositoryToken(Laboratory),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("debe crear un nuevo laboratorio", async () => {
      const dto = { name: "Lab 1", number: 101 };
      const labSaved = { id: 1, ...dto };

      mockLaboratoryRepository.create.mockReturnValue(dto);
      mockLaboratoryRepository.save.mockResolvedValue(labSaved);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(labSaved);
    });
  });

  describe("findOne", () => {
    it("debe retornar un laboratorio si existe", async () => {
      const lab = { id: 1, name: "Lab 1" };
      mockLaboratoryRepository.findOneBy.mockResolvedValue(lab);

      const result = await service.findOne(1);
      expect(result).toEqual(lab);
    });

    it("debe lanzar NotFoundException si no existe", async () => {
      mockLaboratoryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("debe eliminar un laboratorio existente", async () => {
      const lab = { id: 1, name: "Lab 1" };
      // Primero findOne debe encontrarlo
      mockLaboratoryRepository.findOneBy.mockResolvedValue(lab);
      mockLaboratoryRepository.remove.mockResolvedValue(lab);

      const result = await service.remove(1);
      expect(repository.remove).toHaveBeenCalledWith(lab);
      expect(result).toEqual(lab);
    });
  });
});
