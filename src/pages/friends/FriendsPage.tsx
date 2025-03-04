import { motion } from "framer-motion";
import gift_sm from "@/assets/icons/gift_sm.svg";
import gift_lg from "@/assets/icons/gift_lg.svg";
import BadgeModal from "@/components/badge";
import coin from "@/assets/icons/coin.svg";
import bg_friend1 from "@/assets/images/friends/bg_friend1.svg";
import bg_friend2 from "@/assets/images/friends/bg_friend2.svg";
import { TbReload } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoCalendarOutline } from "react-icons/io5";
import { BsCopy } from "react-icons/bs";
import { GrFormNextLink } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useCopyToClipboard } from "react-use";
import {
  useAddReferralMutation,
  useGetReferralListQuery,
  useGetReferralQuery,
} from "@/services/referral";
import LoadingComponent from "@/components/loading-component";
import { toast } from "sonner";
import { useAppSelector } from "@/stores/store";
import { useTranslation } from "react-i18next";

const referralSchema = z.object({
  referralUrl: z
    .string()
    .url({ message: "Invalid URL format" })
    .nonempty({ message: "Referral URL is required" }),
});

type ReferralFormValues = z.infer<typeof referralSchema>;

interface Friend {
  referrer: {
    firstName: string;
    lastName: string;
    name: string;
    avatar: string;
  };
  referee: {
    firstName: string;
    lastName: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
}

const FriendsPage = () => {
  const { t } = useTranslation();
  const [state, copyToClipboard] = useCopyToClipboard();
  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(referralSchema),
  });

  // Get referral code from auth state
  const refCode = useAppSelector(
    (state) =>
      (state.authApi.queries["getMe({})"]?.data as { data: { referralCode: string } })
        ?.data.referralCode
  );

  // API hooks
  const [addReferral] = useAddReferralMutation();
  const { data: referralData, isLoading: referralDataLoading } = useGetReferralQuery({});
  const {
    data: referralList,
    isLoading: referralListLoading,
    refetch: refetchReferralList,
  } = useGetReferralListQuery({ page: 1, limit: 10 });

  // Loading states
  if (referralDataLoading || referralListLoading) return <LoadingComponent />;

  const giftContents = [
    {
      imgContent: gift_sm,
      title: <div className="text-md ">{t("friends.add.title")}</div>,
      content: (
        <div className="flex items-center space-x-1">
          <img src={coin} alt="coin" className="w-4 h-4" />
          <span className="font-semibold text-[#FFC800]">+5</span>
          <span className="font-normal">{t("friends.add.description")}</span>
        </div>
      ),
    },
    {
      imgContent: gift_lg,
      title: <div>{t("friends.add_premium.title")}</div>,
      content: (
        <div className="flex items-center space-x-1">
          <img src={coin} alt="coin" className="w-4 h-4" />
          <span className="font-semibold text-[#FFC800]">+10</span>
          <span className="font-normal">{t("friends.add_premium.description")}</span>
        </div>
      ),
    },
  ];

  const handleCopy = () => {
    copyToClipboard(refCode);
    if (state.error) {
      toast.error(t("friends.copy.error"));
    } else {
      toast.success(t("friends.copy.success"));
    }
  };

  const handleInviteFriend = () => {
    if (!referralData?.data) return;

    const shareText = t("friends.share.message");
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(
      referralData.data
    )}&text=${encodeURIComponent(shareText)}`;

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
    const days = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} ${t("friends.days")}`;
  };

  return (
    <motion.div
      className="w-full flex flex-col p-4 lg:p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5 mb-6">
        {t("friends.title")}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="grid gap-4">
            {giftContents.map((content, index) => (
              <BadgeModal
                key={index}
                {...content}
                className="border border-[#6D4444] hover:border-[#8D5555] transition-colors"
                imgClassName="w-12 h-12"
              />
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
                <h2
                  className="text-xl font-semibold text-shadow-lg drop-shadow-[0_1px_1px_rgba(172,94,94,0.5)] [-webkit-text-stroke:0.2px_#AC5E5E] "
                >
                  {t("friends.referral.title")}
                </h2>
                <p
                  className="text-sm max-w-2/3 text-shadow-lg drop-shadow-[0_0.5px_0.5px_rgba(172,94,94,0.5)] [-webkit-text-stroke:0.1px_#AC5E5E] "
                >
                  {t("friends.referral.description", { refCode })}
                </p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 w-1/2">
                  <FormField
                    control={form.control}
                    name="referralUrl"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={"ABCDE"}
                            className="bg-white border-2 border-[#DBA2A2] placeholder:text-gray-300 text-gray-800"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-[#BD6A6A] border-2 border-[#DBA2A2] text-gray-200 hover:bg-[#a55e5e]"
                  >
                    <IoMdAddCircleOutline className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Right Section - Friends List */}
        <div className="w-full lg:w-1/2">
          <div className="p-6 border border-[#A7A3A3] bg-[#2F3543] rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="border-l-4 border-[#E77C1B] text-gray-50 pl-5 ">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {referralList?.data?.items.map((friend: Friend) => (
                <div
                  key={`${friend.referrer.name}-${friend.referee.name}`}
                  className="p-4 bg-[#41434E] rounded-lg shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={friend.referee.avatar} alt={friend.referee.name} />
                      <AvatarFallback>
                        {friend.referee.firstName[0]}
                        {friend.referee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-end text-sm text-gray-300">
                      <IoCalendarOutline className="h-4 w-4" />
                      <span>{calculateDays(friend.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{friend.referee.name}</span>
                  </div>
                </div>
              ))}

              {(!referralList?.data || referralList?.data.items.length === 0) && (
                <div className="col-span-2 text-center py-8 text-gray-400">
                  {t("friends.list_friends.no_friends_invited")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FriendsPage;