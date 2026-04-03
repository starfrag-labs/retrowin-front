import { randomBytes } from "node:crypto";

export const createWindowKey = () => randomBytes(16).toString("hex");
