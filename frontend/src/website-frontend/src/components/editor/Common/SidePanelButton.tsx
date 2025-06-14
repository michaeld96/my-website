interface SidePanelButtonProps {
    className: string;
    onClick: () => void;
    buttonUIDisplay: string
}
export const SidePanelButton: React.FC<SidePanelButtonProps> = ({
    className, onClick, buttonUIDisplay
}) => {
    return(
        <>
            <button
                className={className}
                onClick={onClick}
            >
                {buttonUIDisplay}
            </button>
        </>
    )
}