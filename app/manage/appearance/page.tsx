import { Separator } from "@/components/ui/separator";
import { AppearanceForm } from "./appearance-form";

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2>Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize the appearance of the app. Switch between day and night themes.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  );
}
