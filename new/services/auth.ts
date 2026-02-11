import { User } from "../types";

// Simulating a backend database using LocalStorage
const USERS_KEY = 'vtu_users_db';
const SESSION_KEY = 'vtu_session';

export const register = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const usersStr = localStorage.getItem(USERS_KEY);
  const users = usersStr ? JSON.parse(usersStr) : [];

  if (users.find((u: any) => u.email === email)) {
    throw new Error("User already exists with this email");
  }

  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    password, // In a real app, this would be hashed!
    history: []
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  const userSession = { id: newUser.id, name: newUser.name, email: newUser.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
  
  return userSession;
};

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const usersStr = localStorage.getItem(USERS_KEY);
  const users = usersStr ? JSON.parse(usersStr) : [];

  const user = users.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const userSession = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));

  return userSession;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
};