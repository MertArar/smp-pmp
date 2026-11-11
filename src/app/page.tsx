import HomeResponsiveStyles from "@/features/home/HomeResponsiveStyles";
import HomeJourney from "@/features/home/HomeJourney";
import SolutionsSection from "@/features/home/solutions/SolutionsSection";
import SolutionsFactory from "@/features/home/solutions-factory/SolutionsFactory";
import StackCards from "@/features/home/stack-cards/StackCards";
import SempaGlobal from "@/features/home/sempa-global/SempaGlobal";
import Smartpump from "@/features/home/smart-pump/SmartPump";
import HomeNews from "@/features/home/home-news/HomeNews";
import GlobalTrust from "@/features/home/global-trust/GlobalTrust";
import SocialMedia from "@/features/home/social-media/SocialMedia";
import HomeVideo from "@/features/home/home-video/HomeVideo";

export default function HomePage() {
  return (
    <main className="relative isolate w-full overflow-x-clip bg-[#061824]">
      <HomeResponsiveStyles />
      <HomeJourney />
      <SolutionsSection />
      <SolutionsFactory />
      <StackCards />
      <SempaGlobal />
      <Smartpump />
      <HomeNews />
      <GlobalTrust />
      <SocialMedia />
      <HomeVideo />
    </main>
  );
}
