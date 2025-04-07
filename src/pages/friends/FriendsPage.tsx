import { motion } from "framer-motion";
import Image from "@/components/image";
import bg_friend1 from "@/assets/images/friends/bg_friend1.svg";
import bg_friend2 from "@/assets/images/friends/bg_friend2.svg";
import { TbReload } from "react-icons/tb";
import { IoCalendarOutline } from "react-icons/io5";
import { BsCopy } from "react-icons/bs";
import { GrFormNextLink } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useCopyToClipboard } from "react-use";
import { useAddReferralMutation, useGetReferralListQuery, useGetReferralQuery } from "@/services/referral";
import LoadingComponent from "@/components/loading-component";
import { toast } from "sonner";
import { useAppSelector } from "@/stores/store";
import { useTranslation } from "react-i18next";
import b_coin from "@/assets/images/friends/coin.png";
import crown from "@/assets/images/friends/crown.svg";
import { SettingKeyEnum } from "@/enums/setting";
import { useCallback, useState } from "react"; // Added useState for pagination
import { SettingValueType } from "@/interfaces/ISetting";
import { useGetUserSettingQuery } from "@/services/user";
import { IUser } from "@/interfaces/IUser";
import jfox from "@/assets/images/jupiter.png";
import { IFriend, IMappedFriend } from "@/interfaces/friend/IFriend";
import FriendInfo from "@/components/friend-info";

const referralSchema = z.object({
  referralUrl: z.string().url({ message: "Invalid URL format" }).nonempty({ message: "Referral URL is required" }),
});

type ReferralFormValues = z.infer<typeof referralSchema>;

const FriendsPage = () => {
  const { t } = useTranslation();
  const [state, copyToClipboard] = useCopyToClipboard();
  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(referralSchema),
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Get referral code from auth state
  const userInfo = useAppSelector((state) => (state.authApi.queries["getMe({})"]?.data as { data: IUser }).data);
  const { data: userSettings } = useGetUserSettingQuery();
  const getSettingValue = useCallback(
    (key: SettingKeyEnum): SettingValueType => {
      const setting = userSettings?.data.find((item: { key: SettingKeyEnum }) => item.key === key);
      return setting?.value ?? "";
    },
    [userSettings]
  );

  // API hooks
  const [addReferral] = useAddReferralMutation();
  const { data: referralData, isLoading: referralDataLoading } = useGetReferralQuery({});
  const {
    data: referralList,
    isLoading: referralListLoading,
    refetch: refetchReferralList,
  } = useGetReferralListQuery({ page: currentPage, limit: itemsPerPage });

  // Loading states
  if (referralDataLoading || referralListLoading) return <LoadingComponent />;

  const handleCopy = () => {
    copyToClipboard(userInfo.referralCode);
    if (state.error) {
      toast.error(t("friends.copy.error"));
    } else {
      toast.success(t("friends.copy.success"));
    }
  };

  const handleInviteFriend = () => {
    if (!referralData?.data) return;

    const shareText = t("friends.share.message");
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(referralData.data)}&text=${encodeURIComponent(
      shareText
    )}`;

    window.open(fullUrl, "_blank");
  };

  const onSubmit = async (data: ReferralFormValues) => {
    try {
      await addReferral({ referralLink: data.referralUrl }).unwrap();
      toast.success(t("friends.referral.success"));
      form.reset();
      refetchReferralList();
    } catch (error) {
      toast.error(t("friends.referral.error"));
      console.error(error);
    }
  };

  const calculateDays = (createdAt: string) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const days = Math.floor((now - createdTime) / msPerDay);

    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const inviteFriendsContents = [
    {
      imgContent: b_coin,
      title: t("friends.add.title"),
      content: (
        <p className="text-xs">
          +{getSettingValue(SettingKeyEnum.REFERRAL_FIXED_POINTS_REFERRER)} {t("friends.add.description")}
        </p>
      ),
    },
    {
      imgContent: crown,
      title: t("friends.add_premium.title"),
      content: (
        <p className="text-xs">
          +{getSettingValue(SettingKeyEnum.REFERRAL_FIXED_POINTS_TELEGRAM_PREMIUM)} {t("friends.add.description")}
        </p>
      ),
    },
  ];

  // Pagination controls
  const totalPages = Math.ceil((referralList?.data?.total || 0) / itemsPerPage);
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const usersListData: IMappedFriend[] = referralList?.data?.items.map((friend: IFriend): IMappedFriend => {
    const isRefereeMe = friend.referee?.id === userInfo.id;
    const user = isRefereeMe ? friend.referrer : friend.referee;
    const rewardTree = isRefereeMe ? friend.referrerRewardTree : friend.refereeRewardTree;

    if (!user) {
      return {
        id: friend.id,
        name: "Anonymous",
        avatar: jfox,
        rewardTree: null,
        pointsBalance: 0,
        bonusPoints: friend.referrerPoints || 0,
        createdAt: friend.createdAt,
      };
    }

    const fullName = user.fullName || "";
    const name = user.name || "";
    const username = user.username || "";
    const avatar = user.avatar || jfox;
    const pointsBalance = user.pointsBalance || 0;
    const bonusPoints = friend.referrerPoints || 0;

    return {
      id: friend.id,
      name: name || username || fullName || "Anonymous",
      avatar,
      rewardTree,
      pointsBalance: pointsBalance,
      bonusPoints: bonusPoints,
      createdAt: friend.createdAt,
    };
  });
  console.log(usersListData);

  return (
    <motion.div
      className="w-full flex flex-col h-screen p-4 lg:p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5">Friends</p>
      <div className="flex flex-col mt-4 lg:flex-row gap-6">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex flex-row w-full space-x-2 h-auto items-center justify-between">
            {inviteFriendsContents.map((inviteFriendsContent, index) => (
              <div
                key={index}
                onClick={() => {}}
                className="flex flex-row w-1/2 border-1 border-[#24E6F300] rounded-lg shadow-lg overflow-auto min-h-40 px-2 bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="flex flex-col justify-center w-4/5">
                  <h3 className="text-lg font-semibold text-white mb-2">{inviteFriendsContent.title}</h3>
                  <div className="text-md font-semibold text-gray-100 line-clamp-2 mr-2">
                    {inviteFriendsContent.content}
                  </div>
                </div>

                <div className="w-1/5 flex items-center justify-center">
                  <Image src={inviteFriendsContent.imgContent} alt={inviteFriendsContent.title} className="size-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Invite Friends Card */}
          <div
            className="w-full aspect-video bg-cover bg-center h-52 rounded-lg border-3 border-[#264B53] p-6"
            style={{ backgroundImage: `url(${bg_friend1})` }}
          >
            <div className="flex flex-col items-end justify-center h-full space-y-4">
              <div className="text-right space-y-2">
                <h2 className="text-xl font-semibold text-shadow-lg drop-shadow-[0_1px_1px_rgba(0,255,255,0.5)] [-webkit-text-stroke:0.3px_#00FFFF]">
                  {t("friends.invite.title")}
                </h2>
                <p className="text-sm max-w-64 text-shadow-lg drop-shadow-[0_0.2px_0.2px_rgba(0,255,255,0.5)] [-webkit-text-stroke:0.1px_#00FFFF]">
                  {t("friends.invite.description")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  size="icon"
                  className="bg-[#205966] size-10 text-gray-200 border-2 border-[#009EC0] hover:bg-[#1d4f5a]"
                >
                  <BsCopy className="size-4" />
                </Button>
                <Button
                  onClick={handleInviteFriend}
                  className="bg-gradient-to-br h-10 w-44 text-gray-200 from-[#264B53] to-[#009EC0] border-2 border-[#009EC0]"
                >
                  {t("friends.invite.btn")}
                  <GrFormNextLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Become Referral Card */}
          <div
            className="w-full aspect-video bg-cover bg-center rounded-lg h-52 border-3 border-[#AC5E5E] p-6"
            style={{ backgroundImage: `url(${bg_friend2})` }}
          >
            <div className="flex flex-col justify-center h-full space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white text-shadow-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] [-webkit-text-stroke:1px_#AC5E5E] inline-block px-2 py-1 rounded">
                  {t("friends.referral.title")}
                </h2>
                <p className="text-sm max-w-2/3 text-white font-medium text-shadow-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] [-webkit-text-stroke:0.5px_#AC5E5E] p-1.5 rounded">
                  {t("friends.referral.description", { refCode: userInfo.referralCode })}
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex gap-2 w-full sm:w-3/4 md:w-1/2 p-2 rounded"
                >
                  <FormField
                    control={form.control}
                    name="referralUrl"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={"ABCDE"}
                            className="bg-white/90 border-2 border-[#DBA2A2] placeholder:text-gray-500 text-gray-800 font-medium"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-white font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-[#BD6A6A] border-2 border-[#DBA2A2] text-white hover:bg-[#a55e5e] shadow-lg"
                  >
                    <IoMdAddCircleOutline className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Right Section - Friends List */}
        <div className="w-full lg:w-1/2 h-auto">
          <div className="p-6 bg-[#05A2C6CC] border-1 border-[#24E6F399] rounded-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold pl-5">
                {t("friends.list_friends.title")}
              </h2>
              <motion.button
                whileTap={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                onClick={() => refetchReferralList()}
                className="p-2 bg-[#E77C1B] rounded-full border-2 border-[#e0ac7b] hover:bg-[#d66f0f]"
              >
                <TbReload className="h-4 w-4 text-white" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usersListData.map((item: IMappedFriend) => (
                  <div key={`${item.id}`} className="p-4 bg-[#41434E] rounded-lg shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <FriendInfo friendInfo={item} />
                      <div className="flex flex-col items-end text-sm text-gray-300">
                        <IoCalendarOutline className="h-4 w-4" />
                        <span>{calculateDays(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {(!referralList?.data || referralList?.data.items.length === 0) && (
                  <div className="col-span-2 text-center py-8 text-gray-50">
                    {t("friends.list_friends.no_friends_invited")}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {referralList?.data?.items.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="bg-[#E77C1B] text-white hover:bg-[#d66f0f] disabled:bg-gray-500"
                >
                  Previous
                </Button>
                <span className="text-gray-50">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-[#E77C1B] text-white hover:bg-[#d66f0f] disabled:bg-gray-500"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FriendsPage;
