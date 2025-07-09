interface DeletePopUpProps {
    deleteUIHeader: string;
    confirmDelete: () => void;
    confirmLable: string;
    closePopUp: (val: boolean) => void;
    cancelLable: string;
}

export const DeletePopUp: React.FC<DeletePopUpProps> = ({
    deleteUIHeader, confirmDelete, confirmLable, closePopUp, cancelLable
}) => {
    return(
        <div className='title-pop-up'>
            <h2>{deleteUIHeader}</h2>
            <div className='title-pop-up-buttons'>
                <button onClick={ confirmDelete }>
                    {confirmLable}
                </button>
                <button onClick={() => { closePopUp(false) }}>
                    {cancelLable}
                </button>
            </div>
        </div>
    )
} 