import { NextFunction, Request, Response } from "express";
import { appConfig } from "../config/env";

export function requireProxyKey(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token || token !== appConfig.proxyApiKey) {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  next();
}

export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const key = req.header("x-admin-key");
  if (!key || key !== appConfig.adminApiKey) {
    return res.status(401).json({ error: { message: "Unauthorized admin" } });
  }
  next();
}
