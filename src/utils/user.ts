import { IUser } from "@/interfaces/IUser";

export function getDisplayName(user: IUser): string {
  return user.fullName || user.name || `${user.firstName} ${user.lastName}` || user.username || "Anonymous";
}

export function shortenHash(hash: string): string {
  if (!hash || hash.length <= 10) return hash;
  return `${hash.slice(0, 5)}...${hash.slice(-5)}`;
}
