import { Controller, Get, StreamableFile } from "@nestjs/common";
import { Auth } from "../auth/decorators/auth.decorator.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { DashboardService } from "./dashboard.service.js";
import { DateTime } from "luxon";

@Auth()
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("pdf")
  async getPdf(@CurrentUser() user: Express.User) {
    const stream = await this.dashboardService.generatePdf(user);
    const timestamp = DateTime.now().toFormat("yyyyLLdd-HHmmss");
    const fileName = `reservas-uneg-${timestamp}.pdf`;

    return new StreamableFile(stream, {
      type: "application/pdf",
      disposition: `inline; filename="${fileName}"`,
    });
  }
}
