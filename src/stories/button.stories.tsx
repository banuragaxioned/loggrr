import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";

export const DefaultButton = () => (
  <div>
    <Button variant="outline">Button</Button>
  </div>
);

export const DestructiveButton = () => (
  <div>
    <Button variant="destructive">Destructive</Button>
  </div>
);

export const OutlineButton = () => (
  <div>
    <Button variant="outline">Outline</Button>
  </div>
);

export const SubtleButton = () => (
  <div>
    <Button variant="subtle">Subtle</Button>
  </div>
);

export const GhostButton = () => (
  <div>
    <Button variant="ghost">Ghost</Button>
  </div>
);

export const LinkButton = () => (
  <div>
    <Button variant="link">Link</Button>
  </div>
);

export const WithIconButton = () => (
  <div>
    <Button>
      <Mail className="mr-2 h-4 w-4" /> Login with Email
    </Button>
  </div>
);

export const LoadingButton = () => (
  <div>
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  </div>
);
