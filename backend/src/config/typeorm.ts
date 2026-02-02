import "dotenv/config";

import { DataSource } from "typeorm";
import { databaseConfig } from "./database";

const config = databaseConfig();

export const dataSource = new DataSource(config);
