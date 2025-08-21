interface UpsertPopUpProps {
    popUpTitle: string;
    placeholder: string;
    upsertEntityName: (input: string) => void; 
    confirmUpsertEntity: () => void;
    confirmUpdateLabel: string;
    closePopUp: (val: boolean) => void;
    cancelLable: string;
};

export const UpsertPopUp: React.FC<UpsertPopUpProps> = ({
    popUpTitle, placeholder, upsertEntityName, confirmUpsertEntity, confirmUpdateLabel, closePopUp, cancelLable
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
                    {confirmUpdateLabel}
                </button>
                <button onClick={() => { closePopUp(false) }}>
                    {cancelLable}
                </button>
            </div>
        </div>
    )
} 