import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { getInitials } from "@workspace/ui/lib/utils";

interface UserAvatarProps {
  name: string;
  image?: string;
  className?: string;
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="rounded-lg">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
