interface UpsertPopUpProps {
    popUpTitle: string;
    placeholder: string;
    upsertEntityName: (input: string) => void; 
    upsertEntityCode: (input: string) => void;
    confirmUpsertEntity: () => void;
    confirmUpdateLabel: string;
    closePopUp: (val: boolean) => void;
    cancelLable: string;
    popUpCode: string;
    popUpPlaceholder: string;
};

export const UpsertPopUpSubjects: React.FC<UpsertPopUpProps> = ({
    popUpTitle, placeholder, upsertEntityName, confirmUpsertEntity, confirmUpdateLabel, closePopUp, cancelLable, popUpCode, upsertEntityCode, popUpPlaceholder
}) => {
    return(
        <div className='title-pop-up'>
            <input
                type='text'
                value={popUpTitle}
                onChange={(e) => { upsertEntityName(e.target.value) }}
                placeholder={placeholder}
            />
            <input
                type='text'
                value={popUpCode}
                onChange={(e) => { upsertEntityCode(e.target.value) }}
                placeholder={popUpPlaceholder}
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