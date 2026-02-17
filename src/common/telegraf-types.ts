import { Telegraf } from 'telegraf';
export type UpdateType = Parameters<typeof Telegraf.prototype.on>[0];
