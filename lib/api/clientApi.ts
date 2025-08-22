import api from "./api";
import { User } from "@/types/user";
import { Note, FormValues } from "@/types/note";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export const registerUser = async (
  email: string,
  password: string
): Promise<User> => {
  const { data } = await api.post("/auth/register", { email, password });
  return data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get("/users/me");
  return data;
};

type checkClientSessionRequest = {
  success: boolean;
};

export const checkClientSession = async () => {
  const res = await api.get<checkClientSessionRequest>("/auth/session");
  return res.data.success;
};

export const updateUser = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const res = await api.patch<User>("/users/me", { username, email });
  return res.data;
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<NotesHttpResponse> => {
  const params: Record<string, string | number> = { page };

  if (search) params.search = search;
  if (tag && tag !== "All") params.tag = tag;

  const { data } = await api.get<NotesHttpResponse>("/notes", { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: FormValues): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
