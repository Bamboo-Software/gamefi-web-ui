import CarouselPlugin from "./components/Carousel";
import AuthForm from "./components/AuthForm";

const AuthPage = () => {
  return (
    <div className="bg-gradient-to-br w-full p-12 flex flex-col items-center h-screen from-[#01030A] to-[#E77C1B]">
      <div className="w-full h-full bg-[#222936] rounded-2xl shadow-2xl shadow-black flex flex-row justify-center items-center overflow-auto">
        <div className="w-1/2 p-4 md:p-8 border-none hidden md:block  items-center justify-center h-auto py-3 overflow-auto">
          <CarouselPlugin />
        </div>

        <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center h-auto py-3 overflow-auto">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
