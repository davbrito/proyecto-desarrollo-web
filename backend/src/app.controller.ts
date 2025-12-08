import { Controller, Get } from "@nestjs/common";
import { performance } from "node:perf_hooks";
import { DataSource } from "typeorm";

@Controller()
export class AppController {
  constructor(private dataSource: DataSource) {}

  @Get("health")
  async getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: await this.checkDatabaseConnection(),
    };
  }

  private async checkDatabaseConnection() {
    try {
      const start = performance.now();
      await this.dataSource.query("SELECT 1");
      const duration = performance.now() - start;
      return { status: "ok", durationMs: duration };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }
}
