export enum MissionTypeEnum {
  SOCIAL = "social",
  REFERRAL = "referral",
  GAME = "game",
  ACHIEVEMENT = "achievement",
  OTHER = "other",
}

export enum MissionStatus {
  OPEN = "open",
  READY_TO_CLAIM = "ready_to_claim",
  PENDING = "pending",
  COMPLETED = "completed",
}

export enum FrequencyEnum {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  PERMANENT = "permanent",
}

export enum SocialTaskTypeEnum {
  YOUTUBE_SUBSCRIBE = "youtube_subscribe",
  YOUTUBE_WATCH = "youtube_watch",
  TIKTOK_WATCH = "tiktok_watch",
  X_FOLLOW = "x_follow",
  X_RETWEET = "x_retweet",
  FACEBOOK_LIKE = "facebook_like",
  FACEBOOK_SHARE = "facebook_share",
  INSTAGRAM_FOLLOW = "instagram_follow",
  INSTAGRAM_LIKE = "instagram_like",
  TELEGRAM_JOIN = "telegram_join",
  VISIT_WEBSITE = "visit_website",
  X_LIKE_COMMENT = "x_like_comment",
  X_SHARE_RETWEET = "x_share_retweet",
  INSTAGRAM_LIKE_COMMENT = "instagram_like_comment",
  INSTAGRAM_SHARE = "instagram_share",
}

export enum ReferralTaskTypeEnum {
  INVITE_1 = "invite_1",
  INVITE_5 = "invite_5",
  INVITE_10 = "invite_10",
  INVITE_20 = "invite_20",
}

export enum AchievementTaskTypeEnum {
  DAILY_LOGIN_STREAK = "daily_login_streak",
  POINT_MILESTONE_100000 = "points_milestone_100000",
  POINT_MILESTONE_500000 = "points_milestone_500000",
}

export enum OtherTaskTypeEnum {
  DAILY_CHECK_IN = "daily_check_in",
  DAILY_SPIN_WHEEL = "daily_spin_wheel",
  PHANTOM_CONNECT = 'phantom_connect',
}
