import { DataSource } from "typeorm";
import { State } from "../src/reservations/entities/state.entity.js";
import { ReserveType } from "../src/reservations/entities/reserve_type.entity.js";
import { Laboratory } from "../src/laboratories/entities/laboratory.entity.js";
import { User } from "../src/users/entities/user.entity.js";
import { RoleEnum } from "@uneg-lab/api-types/auth.js";
import { dataSource } from "../src/config/typeorm.js"; // Asegúrate de exportar tu config
import * as argon2 from "argon2";

async function seed() {
  const ds = await dataSource.initialize();
  console.log("🌱 Iniciando Seeding...");

  try {
    const stateRepo = ds.getRepository(State);
    const states = ["PENDIENTE", "APROBADO", "RECHAZADO", "CANCELADO"];
    for (const name of states) {
      const exists = await stateRepo.findOneBy({ name });
      if (!exists) {
        await stateRepo.save(stateRepo.create({ name }));
        console.log(`✅ Estado creado: ${name}`);
      }
    }

    const typeRepo = ds.getRepository(ReserveType);
    const types = [
      { name: "CLASE", priority: 10, needsApproval: false, blockDuration: 1.5 },
      { name: "EVENTO", priority: 5, needsApproval: true, blockDuration: 2 },
      { name: "MANTENIMIENTO", priority: 20, needsApproval: false, blockDuration: 4 },
    ];
    for (const t of types) {
      const exists = await typeRepo.findOneBy({ name: t.name });
      if (!exists) {
        await typeRepo.save(typeRepo.create(t));
        console.log(`✅ Tipo de reserva creado: ${t.name}`);
      }
    }

    const labRepo = ds.getRepository(Laboratory);
    const labName = "Sala de Computación - Villa Asia";
    const labExists = await labRepo.findOneBy({ name: labName });
    if (!labExists) {
      await labRepo.save(labRepo.create({
        name: labName,
        number: 1,
        active: true
      }));
      console.log(`✅ Laboratorio creado: ${labName}`);
    }

    const userRepo = ds.getRepository(User);
    const adminUsername = "admin";
    const adminExists = await userRepo.findOneBy({ username: adminUsername });
    if (!adminExists) {
      const admin = userRepo.create({
        username: adminUsername,
        email: "admin@uneg.edu.ve",
        name: "Administrador del Sistema",
        password: "AdminPassword123!",
        role: RoleEnum.ADMIN
      });
      await userRepo.save(admin);
      console.log(`✅ Usuario Admin creado. ID: ${admin.id}`);
    }

    console.log("✨ Seeding completado con éxito.");
  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
  } finally {
    await ds.destroy();
  }
}

seed();
