import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AvatarWithImage = () => (
  <div>
    <Avatar>
      <AvatarImage src="https://placekitten.com/300/300" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  </div>
);

export const AvatarWithFallback = () => (
  <div>
    <Avatar>
      <AvatarImage></AvatarImage>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  </div>
);
