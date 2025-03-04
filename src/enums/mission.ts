export enum MissionTypeEnum {
  SOCIAL = "social",
  REFERRAL = "referral",
  GAME = "game",
  ACHIEVEMENT = "achievement",
  OTHER = "other",
}

export enum MissionStatus {
  OPEN = 'open',
  READY_TO_CLAIM = 'ready_to_claim',
  PENDING = 'pending',
  COMPLETED = 'completed'
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
  TWITTER_FOLLOW = "twitter_follow",
  TWITTER_RETWEET = "twitter_retweet",
  FACEBOOK_LIKE = "facebook_like",
  FACEBOOK_SHARE = "facebook_share",
  INSTAGRAM_FOLLOW = "instagram_follow",
  INSTAGRAM_LIKE = "instagram_like",
  TELEGRAM_JOIN = "telegram_join",
}

export enum ReferralTaskTypeEnum {
  INVITE_1 = "invite_1",
  INVITE_5 = "invite_5",
  INVITE_10 = "invite_10",
}

export enum AchievementTaskTypeEnum {
  DAILY_LOGIN_STREAK = "daily_login_streak",
  POINT_MILESTONE_1000 = "points_milestone_1000",
  POINT_MILESTONE_5000 = "points_milestone_5000",
}

export enum OtherTaskTypeEnum {
  CHECK_IN = "check_in",
  TASK_COMPLETION = "task_completion",
  WEEKLY_TASK_STREAK = "weekly_task_streak",
  SOCIAL_SHARING = "social_sharing",
}
