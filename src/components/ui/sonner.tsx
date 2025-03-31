import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={false}
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-gradient-to-r from-[#05A2C6] to-[#24E6F3] text-white border-[#24E6F399] shadow-lg",
          description: "text-gray-100",
          actionButton:
            "bg-white text-[#05A2C6] hover:bg-gray-100",
          cancelButton:
            "bg-gray-700 text-white hover:bg-gray-600",
          // success: "!bg-gradient-to-r !from-green-500 !to-green-400",
          // error: "!bg-gradient-to-r !from-red-500 !to-red-400",
          // warning: "!bg-gradient-to-r !from-amber-500 !to-amber-400",
          // info: "!bg-gradient-to-r !from-blue-500 !to-blue-400",
          success: "!border-[#24E6F3] !bg-gradient-to-t !from-[#24E6F3] !via-[#05A2C6CC] !to-[#54a2c9] !bg-white/50",
          error: "!border-[#24E6F3] !bg-gradient-to-t !from-[#24E6F3] !via-[#05A2C6CC] !to-[#54a2c9] !bg-white/50",
          warning: "!border-[#24E6F3] !bg-gradient-to-t !from-[#24E6F3] !via-[#05A2C6CC] !to-[#54a2c9] !bg-white/50",
          info: "!border-[#24E6F3] !bg-gradient-to-t !from-[#24E6F3] !via-[#05A2C6CC] !to-[#54a2c9] !bg-white/50",

        },
        style: {
          background: 'linear-gradient(to right, #05A2C6, #24E6F3)',
          color: 'white',
          border: '1px solid rgba(36, 230, 243, 0.6)',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }