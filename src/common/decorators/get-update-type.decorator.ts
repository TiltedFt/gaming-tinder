import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

// extracts the update type from context (message, callback_query, inline_query)
export const GetUpdateType = createParamDecorator(
  (_, ctx: ExecutionContext) =>
    TelegrafExecutionContext.create(ctx).getContext().updateType,
);

