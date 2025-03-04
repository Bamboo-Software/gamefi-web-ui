import coin from '@/assets/icons/coin.svg';
import task from '@/assets/icons/task_icon.svg';
import spinner from '@/assets/icons/spinner_icon.svg';
import friend from '@/assets/icons/friends.svg';
import achivements from '@/assets/icons/cup_icon.svg';
import { useTranslation } from 'react-i18next';

interface IAirdropContentDialog {
    imgContent: string;
    thumbnail: string;
    title: string;
    dialog: {
        title: string,
        description: string
    }
}

export function AirdropContentDialog(): Record<string, IAirdropContentDialog>{
    const {t} = useTranslation();
    return {   
    passive:{
        imgContent: coin,
        thumbnail: coin,
        title: t("airdrop.contents.passive.title"),
        dialog: {
            title: t("airdrop.contents.passive.dialog.title"), 
            description: t("airdrop.contents.passive.dialog.description")
        }
    },
    task:{
        imgContent: task,
        thumbnail: coin,
        title: t("airdrop.contents.task.title"),
        dialog: {
            title: t("airdrop.contents.task.dialog.title"), 
            description: t("airdrop.contents.task.dialog.description")
        }
    },
    spinner:{
        imgContent: spinner,
        thumbnail: coin,
        title: t("airdrop.contents.spinner.title"),
        dialog: {
            title: t("airdrop.contents.spinner.dialog.title"), 
            description: t("airdrop.contents.spinner.dialog.description")
        }
    },
    friends:{
        imgContent: friend,
        thumbnail: coin,
        title:  t("airdrop.contents.friends.title"),
        dialog: {
            title: t("airdrop.contents.friends.dialog.title"), 
            description: t("airdrop.contents.friends.dialog.description")
        }
    },
    achivements:{
        imgContent: achivements,
        thumbnail: coin,
        title: t("airdrop.contents.achivements.title"),
        dialog: {
            title: t("airdrop.contents.achivements.dialog.title"), 
            description: t("airdrop.contents.achivements.dialog.description")
        }
    }}
}