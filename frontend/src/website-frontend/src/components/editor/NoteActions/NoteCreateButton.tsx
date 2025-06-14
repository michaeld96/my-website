interface CreateNoteProps {
    onClick : () => void;
}

export const NoteCreateButton: React.FC<CreateNoteProps> = ({
    onClick
}) => {
    return(
        <>
            <h4>Titles</h4>
            <button 
                className='create-button'
                onClick={ onClick }
            >
                Create
            </button>
        </>
    );
};