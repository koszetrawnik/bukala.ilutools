import { useAppStore } from "@/lib/store/app.store";
import { TABS_CONFIG } from "@/lib/config";
import { ViewId } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AppTabs = () => {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  return (
    <Tabs value={view} onValueChange={(v) => setView(v as ViewId)}>
      <TabsList className={`flex flex-row w-full`}>
        {TABS_CONFIG.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS_CONFIG.map((tab) => {
        const ViewComponent = tab.component;
        return (
          <TabsContent key={tab.id} value={tab.id} className="mt-3">
            <ViewComponent />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
