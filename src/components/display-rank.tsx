import rank1 from "@/assets/images/airdrop/rank1.svg"
import rank2 from "@/assets/images/airdrop/rank2.svg"
import rank3 from "@/assets/images/airdrop/rank3.svg"

export const getRankDisplay = (index: number, className?: string) => {
    const rankImages = {
        1: rank1,
        2: rank2,
        3: rank3
    };
    
    if (index <= 3) {
        return <img src={rankImages[index as keyof typeof rankImages]} alt={`Rank ${index}`} className="h-10" />;
    }
    return <span className={`text-gray-100 font-bold text-center ${className}`}>{`#${index}`}</span>;
};