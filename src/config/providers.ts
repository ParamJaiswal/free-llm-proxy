import fs from "fs";
import path from "path";
import { ProvidersFile } from "../types";

export function loadProvidersConfig(): ProvidersFile {
  const filePath = path.resolve(process.cwd(), "config/providers.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ProvidersFile;
}
