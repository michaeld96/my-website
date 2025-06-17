import { Note } from "../../types/note";

export const NoteSelector: React.FC<{
    notes: Note[];
    selectedNote: Note | null;
    handleNoteClick: (note: Note) => void;
}> = ({notes, selectedNote, handleNoteClick}) => {
    return(
        <ul>
            {notes.map((note) => (
                <li 
                    key={note.id} 
                    onClick={() => handleNoteClick(note)}
                    className={`list-item ${note == selectedNote ? 'active' : ''}`}
                >
                    {note.title}
                </li>
            ))}
        </ul>
    )
}