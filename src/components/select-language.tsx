import { FaLanguage } from "react-icons/fa";
import { useState } from "react";
import { BadgeCheck } from 'lucide-react';
import { useTranslation } from "react-i18next";
import english_icon from '@/assets/icons/flags/english_icon.svg';
import espanol_icon from '@/assets/icons/flags/espanol_icon.svg';
import french_icon from '@/assets/icons/flags/france_icon.svg';
import german_icon from '@/assets/icons/flags/german_icon.svg';
import russia_icon from '@/assets/icons/flags/russia_icon.svg';
import vietnamese_icon from '@/assets/icons/flags/vietnamese_icon.svg';
import chinese_icon from '@/assets/icons/flags/chinese_icon.svg';
import japanese_icon from '@/assets/icons/flags/japanese_icon.svg';
import korean_icon from '@/assets/icons/flags/korean_icon.svg';
import arabic_icon from '@/assets/icons/flags/arabic_icon.svg';

interface ILanguageSelectBtn {
    languages: { code: string; name: string; icon?: React.ReactNode }[];
    onLanguageChange: (code: string) => void;
}

const SettingSelectLanguageList = ({ languages, onLanguageChange }: ILanguageSelectBtn) => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language || "en");

    const handleLanguageChange = (code: string) => {
        setCurrentLanguage(code);
        onLanguageChange(code);
    };

    return (
        <div className="flex flex-col w-52 overflow-scroll space-y-1 bg-[#050817] p-2 rounded-lg shadow-2xl border-1 border-gray-700">
            {languages.map((language) => (
                <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`flex flex-row w-full hover:bg-gray-600 items-center p-1 justify-between bg-gradient-to-r 
                         
                        } rounded-sm`}
                >
                    <div className="flex flex-row items-center justify-start">
                        <div className="relative mr-3">
                            {language.icon || <FaLanguage className="text-white size-7" />}
                        </div>
                        <p className="font-semibold text-white text-xs">{language.name}</p>
                    </div>
                    {currentLanguage === language.code ?
                     <BadgeCheck className="size-6 text-white"/>:
                     <div className="size-6 rounded-full bg-[#16273666]"/>
                    }
                </button>)
            )}
        </div>
    );
};

const SelectLanguage = () => {
    const { t, i18n } = useTranslation();

    const languages = [
      { code: "en", name: t('settings.language.en'), icon: <img className="size-7" src={english_icon}/> },
      { code: "es", name: t('settings.language.es'), icon: <img className="size-7" src={espanol_icon}/> },
      { code: "fr", name: t('settings.language.fr'), icon: <img className="size-7" src={french_icon}/> },
      { code: "de", name: t('settings.language.de'), icon: <img className="size-7" src={german_icon}/> },
      { code: "ru", name: t('settings.language.ru'), icon: <img className="size-7" src={russia_icon}/> },
      { code: "vi", name: t('settings.language.vi'), icon: <img className="size-7" src={vietnamese_icon}/> },
      { code: "zh", name: t('settings.language.zh'), icon: <img className="size-7" src={chinese_icon}/> },
      { code: "ja", name: t('settings.language.ja'), icon: <img className="size-7" src={japanese_icon}/> },
      { code: "ko", name: t('settings.language.ko'), icon: <img className="size-7" src={korean_icon}/> },
      { code: "ar", name: t('settings.language.ar'), icon: <img className="size-7" src={arabic_icon}/> },
    ];

    const handleLanguageChange = (code: string) => {
      i18n.changeLanguage(code); 
    };
  return (
    <div className="w-full flex flex-col items-center justify-center mt-2 px-2">
      <div className="w-full mt-12 overflow-auto">
        <SettingSelectLanguageList
          languages={languages}
          onLanguageChange={handleLanguageChange} />
      </div>
    </div>
  )
}

export default SelectLanguage