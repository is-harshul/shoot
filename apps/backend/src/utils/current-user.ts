import type { User } from "@shoot/shared";

import { mockUsers } from "../data/mock-db.js";

export const CURRENT_USER_ID = "11111111-1111-1111-1111-111111111111";

export const getCurrentUser = () => {
  const user = mockUsers.find((entry: User) => entry.id === CURRENT_USER_ID);
  if (!user) {
    throw new Error("Current user not seeded in mock data");
  }
  return user;
};
