import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { MenuAction } from "src/bot/main-menu-scene/components/main-menu.component";
import { BaseComponent } from "src/common/base/base.component";
import { Language } from "src/common/constants/supported-language";
import { I18nKey } from "src/i18n/i18n-keys";
import { Markup } from "telegraf";

@Injectable()
export class UpdateDescriptionComponent extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(lang: Language) {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.t(I18nKey.SHOW_MY_PROFILE, lang),
          MenuAction.GO_TO_PROFILE,
        ),
        Markup.button.callback(
          this.t(I18nKey.START_SEARCHING, lang),
          MenuAction.START_TO_SEARCH,
        ),
      ],
    ]);
  }
}
