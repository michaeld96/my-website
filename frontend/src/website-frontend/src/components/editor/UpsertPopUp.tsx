interface UpsertPopUpProps {
    popUpTitle: string;
    placeholder: string;
    upsertEntityName: (input: string) => void; 
    confirmUpsertEntity: () => void;
    confirmUpdateLable: string;
    closePopUp: (val: boolean) => void;
    cancelLable: string;
};

export const UpsertPopUp: React.FC<UpsertPopUpProps> = ({
    popUpTitle, placeholder, upsertEntityName, confirmUpsertEntity, confirmUpdateLable, closePopUp, cancelLable
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
                <button onClick={ confirmUpsertEntity }>
                    {confirmUpdateLable}
                </button>
                <button onClick={() => { closePopUp(false) }}>
                    {cancelLable}
                </button>
            </div>
        </div>
    )
}