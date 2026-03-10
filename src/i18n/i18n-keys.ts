export enum GreeterKey {
  WELCOME_NEW_USER = 'greeter.welcome_new',
}

export enum RegistrationKey {
  LANGUAGE_FOUND = 'registration.language_found',
  LANGUAGE_NOT_FOUND = 'registration.language_not_found',
  ASK_PUBLIC_USERNAME = 'registration.ask_public_username',
}

export enum ProfileKey {
  CARD_TITLE = 'profile.card_title',
  DESCRIPTION = 'profile.description',
  AGE = 'profile.age',
  GENDER = 'profile.gender',
  GAMES = 'profile.games',
  HAS_MIC = 'profile.has_mic',
  COMMUNICATION = 'profile.communication',
  NOT_SET = 'profile.not_set',
  NO_GAMES = 'profile.no_games',
  MIC_YES = 'profile.mic_yes',
  MIC_NO = 'profile.mic_no',
  GENDER_MALE = 'profile.gender_male',
  GENDER_FEMALE = 'profile.gender_female',
  GENDER_OTHER = 'profile.gender_other',
  NO_AVATAR = 'profile.no_avatar',
  ONBOARDING_MESSAGE = 'profile.onboarding_message',
  BTN_DESCRIPTION = 'profile.btn_description',
  BTN_AGE = 'profile.btn_age',
  BTN_GENDER = 'profile.btn_gender',
  BTN_GAMES = 'profile.btn_games',
  BTN_MIC = 'profile.btn_mic',
  BTN_COMMUNICATION = 'profile.btn_communication',
  BTN_SEARCH = 'profile.btn_search',
  BTN_MAIN_MENU = 'profile.btn_main_menu',
  BTN_AVATAR = 'profile.btn_avatar',
  BTN_SEE_AS_OTHER_USER = 'profile.btn_see_as_other_user',
  EDIT_DESCRIPTION = 'profile.edit_description',
  EDIT_AGE = 'profile.edit_age',
  EDIT_COMMUNICATION = 'profile.edit_communication',
  EDIT_GENDER = 'profile.edit_gender',
  EDIT_AVATAR = 'profile.edit_avatar',
  CANCEL_AVATAR_UPLOAD = 'profile.cancel_avatar_upload',
  SPOKEN_LANGUAGES = 'profile.spoken_languages',
  CHOOSE_SPOKEN_LANGUAGES = 'profile.chose_spoken_language',
}

export enum ServerErrorKey {
  SOMETHING_WENT_WRONG = 'server-error.something_went_wrong',
}

export enum UserErrorKey {
  USERNAME_TAKEN = 'user-error.duplicate_publicUsername',
  ACCOUNT_EXISTS = 'user-error.duplicate_telegramId',
  INVALID_PUBLIC_USERNAME = 'user-error.invalid_public_username',
  PLEASE_USE_BUTTONS = 'user-error.please_use_buttons',
  TEXT_ONLY_PLEASE = 'user-error.text_only_please',
  SESSION_EXPIRED = 'user-error.session_expired',
  INVALID_AGE = 'user-error.invalid_age',
}

export enum MainMenuKey {
  SHOW_MY_PROFILE = 'main-menu.show_my_profile',
  START_SEARCHING = 'main-menu.start_searching',
  TITLE = 'main-menu.title',
}

export enum CommonButtonKey {
  BACK = 'common-buttons.back',
  ACCEPT = 'common-buttons.accept',
  CANCEL = 'common-buttons.cancel',
  SAVE = 'common-buttons.save',
}

export enum GamesKey {
  LIST_TITLE = 'games.list_title',
  LIST_EMPTY = 'games.list_empty',
  BTN_ADD = 'games.btn_add_game',
  BTN_REMOVE = 'games.btn_remove',
  BTN_BACK_TO_PROFILE = 'games.btn_back_to_profile',
  BTN_BACK_TO_LIST = 'games.btn_back_to_list',
  BTN_PREV_PAGE = 'games.btn_prev_page',
  BTN_NEXT_PAGE = 'games.btn_next_page',
  PAGE_INDICATOR = 'games.page_indicator',
  SEARCH_PROMPT = 'games.search_prompt',
  SEARCH_NO_RESULTS = 'games.search_no_results',
  SEARCH_RESULTS_TITLE = 'games.search_results_title',
  BTN_ADD_RESULT = 'games.btn_add',
  ADDED = 'games.game_added',
  REMOVED = 'games.game_removed',
  ALREADY_ADDED = 'games.game_already_added',
  LIMIT_REACHED = 'games.game_limit_reached',
}
