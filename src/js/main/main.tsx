import { AppTabs } from "@/components/layout/AppTabs";
import { Footer } from "@/components/layout/Footer";

export const App = () => {
  return (
    <div className="p-3 pb-8">
      <AppTabs />
      <Footer />
    </div>
  );
};
