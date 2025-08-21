import axios from "axios";
import { FormValues, Note } from "../types/note";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN!;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<NotesHttpResponse> => {
  const params: Record<string, string | number> = {
    page,
  };

  if (search) {
    params.search = search;
  }

  if (tag && tag !== "All") {
    params.tag = tag;
  }

  const { data } = await axios.get<NotesHttpResponse>(`${BASE_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    params,
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });

  return response.data;
};

export const createNote = async (note: FormValues): Promise<Note> => {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, note, {
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return response.data;
};
