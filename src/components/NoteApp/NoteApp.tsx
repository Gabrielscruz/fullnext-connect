'use client';
import { useAuthentication } from "@/context/authenticationContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatStringDate } from "@/utils/date";
import React, { useState, useEffect } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { PiMinus, PiPlus, PiTrashFill } from "react-icons/pi";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { translations } from "./translations";

// Tipos
interface Note {
    id: string;
    text: string;
    date: string;
    position: { x: number; y: number };
    minimize: boolean;
}

interface NoteAppProps {
    id: number;
}

const NoteApp: React.FC<NoteAppProps> = ({ id }) => {
    const { user } = useAuthentication();
    const { language } = useLanguage();
    const t = translations[language];
    const storageKey = `notes_${user?.id}_${id}`;
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        if (user?.id) {
            const storedNotes = localStorage.getItem(storageKey);
            if (storedNotes) {
                setNotes(JSON.parse(storedNotes));
            }
        }
    }, [id, user?.id]);

    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(storageKey, JSON.stringify(notes));
        }
    }, [notes, id, user?.id]);

    const handleAddNote = () => {
        const newNote: Note = {
            id: uuidv4(),
            text: "",
            date: formatStringDate(new Date()),
            position: { x: 0, y: 0 },
            minimize: false,
        };
        setNotes([...notes, newNote]);
    };

    const handleDeleteNote = (noteId: string) => {
        Swal.fire({
            background: 'var(--container)', color: 'var(--text)',
            title: t.deleteMenssagem.deleteTitle,
            showCancelButton: true,
            confirmButtonText: t.deleteMenssagem.yes,
            cancelButtonText: t.deleteMenssagem.no,
        }).then((result) => {
            if (result.isConfirmed) {
                setNotes(notes.filter((note) => note.id !== noteId));
            }
        });
    };

    const handleDragNote = (e: DraggableEvent, data: DraggableData, noteId: string) => {
        setNotes(
            notes.map((note) =>
                note.id === noteId ? { ...note, position: { x: data.x, y: data.y } } : note
            )
        );
    };

    const handleEditNote = (e: React.ChangeEvent<HTMLTextAreaElement>, noteId: string) => {
        setNotes(
            notes.map((note) =>
                note.id === noteId ? { ...note, text: e.target.value } : note
            )
        );
    };

    const handleMinimize = (noteId: string) => {
        setNotes(
            notes.map((note) =>
                note.id === noteId ? { ...note, minimize: true } : note
            )
        );
    };

    const handleNotMinimize = (noteId: string) => {
        setNotes(
            notes.map((note) =>
                note.id === noteId ? { ...note, minimize: false } : note
            )
        );
    };

    return (
        <>
            <div className="absolute right-4">
                <div className="relative flex flex-col justify-end items-end gap-2">
                    <button onClick={handleAddNote} className="btn btn-success w-12 h-12 border-none text-white">
                        <PiPlus />
                    </button>
                    <details className="dropdown">
                        <summary className="btn my-1 btn-sucess bg-base-100 btn-outline w-12 h-12">
                            {notes.filter((note) => note.minimize).length}
                        </summary>
                        {notes.filter((note) => note.minimize).length > 0 && (
                            <ul className="absolute menu flex flex-row gap-2 right-0 bg-base-100 rounded-md z-40 p-2 max-h-72 overflow-y-auto">
                                {notes.filter((note) => note.minimize).map((note) => (
                                    <li key={note.id} onClick={() => handleNotMinimize(note.id)} className="flex flex-col bg-primary text-white 300 h-20 rounded-md">
                                        <div className="flex flex-col gap-2 items-start h-full">
                                            <div className="flex flex-row justify-between items-center gap-2 w-full">
                                                <p className="font-extrabold text-xs">{note.date}</p>
                                            </div>
                                            <pre title={note.text} className="font-normal text-wrap text-ellipsis truncate w-52">{note.text}</pre>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </details>
                </div>
            </div>
            {notes.filter((note) => !note.minimize).map((note) => (
                <Draggable key={note.id} position={note.position} onStop={(e, data) => handleDragNote(e, data, note.id)}>
                    <div className="absolute w-72 bg-primary text-white px-3 rounded-lg shadow-lg cursor-move min-h-fit z-40">
                        <div className="w-full h-10 flex justify-between items-center">
                            <span className="font-extrabold">{note.date}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleDeleteNote(note.id)} className="btn btn-sm btn-error rounded-md text-white mt-2 text-sm hover:underline">
                                    <PiTrashFill />
                                </button>
                                <button onClick={() => handleMinimize(note.id)} className="btn btn-sm btn-neutral rounded-md text-white mt-2 text-sm hover:underline">
                                    <PiMinus />
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={note.text}
                            onChange={(e) => handleEditNote(e, note.id)}
                            placeholder={t.textarea.placeholder}
                            className="w-full min-h-32 p-2 placeholder:text-gray-100 border rounded-lg resize-none bg-transparent border-none outline-none"
                        />
                    </div>
                </Draggable>
            ))}
        </>
    );
};

export default NoteApp