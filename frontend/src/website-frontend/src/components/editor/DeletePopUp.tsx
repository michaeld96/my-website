// <div className='title-pop-up'>
//     <h2>Are you sure you want to delete this note?</h2>
//     <div className='title-pop-up-buttons'>
//         <button onClick={ handleDeleteNote }>
//             Delete
//         </button>
//         <button onClick={() => { setDeleteNotePopUp(false) }}>
//             Cancel
//         </button>
//     </div>
// </div>
interface DeletePopUpProps {
    deleteUIHeader: string;
    acceptDelete: () => void;
    acceptUIOutput: string;
    closePopUp: (val: boolean) => void;
    declineUIOutput: string;
}

export const DeletePopUp: React.FC<DeletePopUpProps> = ({
    deleteUIHeader, acceptDelete, acceptUIOutput, closePopUp, declineUIOutput
}) => {
    return(
        <div className='title-pop-up'>
            <h2>{deleteUIHeader}</h2>
            <div className='title-pop-up-buttons'>
                <button onClick={ acceptDelete }>
                    {acceptUIOutput}
                </button>
                <button onClick={() => { closePopUp(false) }}>
                    {declineUIOutput}
                </button>
            </div>
        </div>
    )
} 