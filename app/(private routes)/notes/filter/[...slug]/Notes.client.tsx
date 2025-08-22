"use client";

import { useState } from "react";
import {
  useQuery,
  UseQueryResult,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchNotes, NotesHttpResponse } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import { useDebounce } from "@/hooks/useDebouncedValue";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Loader from "@/components/Loader/Loader";
import { ErrorMessageEmpty } from "@/components/ErrorMessageEmpty/ErrorMessageEmpty";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import Link from "next/link";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialNotes: Note[];
  initialTotalPages: number;
  tag: string;
}

export default function NotesClient({
  initialNotes,
  initialTotalPages,
  tag,
}: NotesClientProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  }: UseQueryResult<NotesHttpResponse, Error> = useQuery<NotesHttpResponse>({
    queryKey: ["notes", debouncedSearch, page, tag],
    queryFn: () => fetchNotes(debouncedSearch, page, tag),
    initialData: {
      notes: initialNotes,
      totalPages: initialTotalPages,
    },
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];
  const pageCount = data?.totalPages ?? 1;

  if (isError && error) throw error;

  return (
    <div className={css.app}>
      <ToastContainer />

      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        {pageCount > 1 && (
          <Pagination
            totalPages={pageCount}
            currentPage={page}
            onPageChange={({ selected }) => setPage(selected + 1)}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <Loader />}

      {!isLoading && !isError && (
        <>
          {notes.length > 0 ? (
            <NoteList notes={notes} />
          ) : (
            <ErrorMessageEmpty />
          )}
        </>
      )}
    </div>
  );
}
