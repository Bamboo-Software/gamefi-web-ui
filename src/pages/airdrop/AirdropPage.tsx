import AirdropBadge from "./components/AirdropBadge"
import { AirdropBadgeProps } from "./components/AirdropBadge";
import income from "@/assets/images/airdrop/income.svg";
import achivements from "@/assets/images/airdrop/achivements.svg";
import friends from "@/assets/images/airdrop/friends.svg";
import spinner from "@/assets/images/airdrop/spinner.svg";
import tasks from "@/assets/images/airdrop/tasks.svg";

const airdropContents: AirdropBadgeProps[] = [
  {
    title: "Passive Income",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: income,
    color: "#E77C1B",
    bgColor: "#29221C",
  },
  {
    title: "Lottery Spinner",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: spinner,
    color: "#65DEB8",
    bgColor: "#243C48",
  },
  {
    title: "Invite friends",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: friends,
    color: "#6D89FF",
    bgColor: "#2A334A",
  },
  {
    title: "Earn tasks",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: tasks,
    color: "#EB886D",
    bgColor: "#47313D",
  },
  {
    title: "Achivements",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: achivements,
    color: "#5A2DFD",
    bgColor: "#47313D",
  },
]

const AirdropPage = () => {
  return (
    <div className="w-full h-auto overflow-scroll flex flex-col">
      <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5">Airdrop</p>
      <div className="flex flex-col md:flex-row">
        <div className="w-1/2">
          Hello
        </div>
        <div className="w-1/2 container mx-auto p-10">
          <div className="grid grid-cols-2 gap-2 md:gap-8">
            {airdropContents.map((airdrop, index) => (
              <div key={index} className="transform transition-all duration-300 hover:translate-y-[-4px]">
                <AirdropBadge
                  title={airdrop.title}
                  description={airdrop.description}
                  imageUrl={airdrop.imageUrl}
                  color={airdrop.color}
                  bgColor={airdrop.bgColor}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  )
}

export default AirdropPage