import { IUser } from "@/interfaces/IUser";

export function getDisplayName(user: IUser): string {
  return user.fullName || user.name || `${user.firstName} ${user.lastName}` || user.username || "Anonymous";
}
