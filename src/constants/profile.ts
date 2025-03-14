import coin from "@/assets/icons/coin.svg";
import transaction from "@/assets/icons/transaction_icon.svg";
import friends from "@/assets/icons/friends_icon.svg";
import achivements from "@/assets/icons/cup_icon.svg";
import x from "@/assets/icons/x.svg";
import google from "@/assets/icons/google.svg";
import facebook from "@/assets/icons/facebook.svg";
import instagram from "@/assets/icons/instagram.svg";
import { useTranslation } from "react-i18next";
import wallets from "@/assets/images/profile/wallet.svg";

interface IContentDialog {
  imgContent: string;
  title: string;
}

interface IProfileContentDialog extends IContentDialog {
  dialog: {
    title: string;
    description: string;
  };
}

export interface IWalletContentDialog extends IContentDialog{
  alert: {
    success: string,
    failure: string
  }
}

export const ProfileContentDialog = (): Record<
  string,
  IProfileContentDialog
> => {
  const { t } = useTranslation();
  return {
    totalCoins: {
      imgContent: coin,
      title: t("profile.total_coin.title"),
      dialog: {
        title: t("profile.total_coin.popup.title"),
        description: t("profile.total_coin.popup.description"),
      },
    },
    transactions: {
      imgContent: transaction,
      title: t("profile.transactions.title"),
      dialog: {
        title: t("profile.transactions.popup.title"),
        description: t("profile.transactions.popup.description"),
      },
    },
    friends: {
      imgContent: friends,
      title: t("profile.friends.title"),
      dialog: {
        title: t("profile.friends.popup.title"),
        description: t("profile.friends.popup.description"),
      },
    },
    achivements: {
      imgContent: achivements,
      title: t("profile.achivements.title"),
      dialog: {
        title: t("profile.achivements.popup.title"),
        description: t("profile.achivements.popup.description"),
      },
    }
  };
};


export const WalletContentDialog = (): Record<
  string,
  IWalletContentDialog
> => {
  const { t } = useTranslation();

  return {
    wallets: {
      imgContent: wallets,
      title: t("profile.wallet.title", {wallet: "wallets"}),
      alert: {
        success: t("profile.wallet.alert.success", {wallet: "wallets"}),
        failure: t("profile.wallet.alert.failure", {wallet: "wallets"}),
      }
    }
  }
}


export const SocialContentDialog = (): Record<
  string,
  IWalletContentDialog
> => {
  const { t } = useTranslation();

  return {
    google: {
      imgContent: google,
      title: t("profile.wallet.title", {wallet: "Google"}),
      alert: {
        success: t("profile.wallet.alert.success", {wallet: "Google"}),
        failure: t("profile.wallet.alert.failure", {wallet: "Google"}),
      }
    },
    x: {
      imgContent: x,
      title: t("profile.wallet.title", {wallet: "X (Twitter)"}),
      alert: {
        success: t("profile.wallet.alert.success", {wallet: "X (Twitter)"}),
        failure: t("profile.wallet.alert.failure", {wallet: "X (Twitter)"}),
      }
    },
    facebook: {
      imgContent: facebook,
      title: t("profile.wallet.title", { wallet: "Facebook" }),
      alert: {
        success: t("profile.wallet.alert.success", { wallet: "Facebook" }),
        failure: t("profile.wallet.alert.failure", { wallet: "Facebook" }),
      },
    },
    instagram: {
      imgContent: instagram,
      title: t("profile.wallet.title", { wallet: "Instagram" }),
      alert: {
        success: t("profile.wallet.alert.success", { wallet: "Instagram" }),
        failure: t("profile.wallet.alert.failure", { wallet: "Instagram" }),
      },
    },
  }
}