        // <div className='title-pop-up'>
        //     <input
        //         type='text'
        //         value={newTitle}
        //         onChange={(e) => { setNewTitle(e.target.value) }}
        //         placeholder="Enter new note title."
        //     />
        //     <div className='title-pop-up-buttons'>
        //         <button onClick={ handleCreateNote }>
        //             Create
        //         </button>
        //         <button onClick={() => { setShowTitlePopUp(false) }}>
        //             Cancel
        //         </button>
        //     </div>
        // </div>
interface UpsertPopUpProps {
    popUpTitle: string;
    placeholder: string;
    upsertEntityName: (input: string) => void; 
    acceptUpsertEntity: () => void;
    acceptUIOutput: string;
    closePopUp: (val: boolean) => void;
    declineUIOutput: string;
};

export const UpsertPopUp: React.FC<UpsertPopUpProps> = ({
    popUpTitle, placeholder, upsertEntityName, acceptUpsertEntity, acceptUIOutput, closePopUp, declineUIOutput
}) => {
    return(
        <div className='title-pop-up'>
            <input
                type='text'
                value={popUpTitle}
                onChange={(e) => { upsertEntityName(e.target.value) }}
                placeholder={placeholder}
            />
            <div className='title-pop-up-buttons'>
                <button onClick={ acceptUpsertEntity }>
                    {acceptUIOutput}
                </button>
                <button onClick={() => { closePopUp(false) }}>
                    {declineUIOutput}
                </button>
            </div>
        </div>
    )
}