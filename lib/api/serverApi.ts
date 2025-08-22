import api from "./api";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { Note } from "@/types/note";

export async function getCookiesHeader(): Promise<string> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`
    )
    .join("; ");

  return cookieStr;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const checkServerSession = async () => {
  const cookieHeader = await getCookiesHeader();
  const res = await api.get("/auth/session", {
    headers: { Cookie: cookieHeader },
  });
  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieHeader = await getCookiesHeader();
  const { data } = await api.get("/users/me", {
    headers: { Cookie: cookieHeader },
  });
  return data;
};

export const fetchNotes = async (
  search = "",
  page = 1,
  tag?: string
): Promise<NotesResponse> => {
  const cookieHeader = await getCookiesHeader();
  const { data } = await api.get("/notes", {
    params: { search, page, perPage: 12, tag },
    headers: { Cookie: cookieHeader },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookiesHeader();
  const { data } = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });
  return data;
};
