import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background">
      <Separator />
      <p className="text-center text-[10px] text-gray-300 py-1">
        created with ❤️ by bukala
      </p>
    </footer>
  );
};
