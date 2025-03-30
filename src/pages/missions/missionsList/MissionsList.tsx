// MissionsList.tsx
import ContentList from "@/components/content-list";


interface MissionsListProps {
    missions: {
        imgContent: string;
        title: string;
        content: React.ReactNode;
        dialog: React.ReactNode;
    }[];
    frequency: string; 
}

const MissionsList = ({ missions }: MissionsListProps) => {
    return (
        <div className="w-full">
            {/* <h3 className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-md pl-5 ml-5 mt-6">All Missions</h3> */}
            <ContentList contents={missions} />
        </div>
    )
}

export default MissionsList;
