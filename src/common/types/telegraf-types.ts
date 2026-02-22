import { Telegraf } from 'telegraf';
export type UpdateType = Parameters<typeof Telegraf.prototype.on>[0];

export enum SenderParams {
  // String | Undefined
  FIRST_NAME = 'first_name',
  // Number | Undefined
  ID = 'id',
  // Boolean | Undefined
  IS_BOT = 'is_bot',
  // Boolean | Undefined
  IS_PREMIUM = 'is_premium',
  // IETF language code (String | Undefined)
  LANGUAGE_CODE = 'language_code',
  // String | Undefined
  LAST_NAME = 'last_name',
  // String | Undefined
  USERNAME = 'user_name',
}
