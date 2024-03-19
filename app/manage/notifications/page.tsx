import { Separator } from "@/components/ui/separator";
import { NotificationsForm } from "./notification-form";

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2>Notifications</h2>
        <p className="mt-1 text-sm text-muted-foreground">Configure how you receive notifications.</p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
}
