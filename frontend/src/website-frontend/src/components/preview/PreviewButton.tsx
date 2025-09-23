import './PreviewButton.css'
interface PreviewProps {
    name: string
    school: string
    onClick?: () => void; // callback. optional and accepts no parameters and returns nothing. parent must pass a function that matches this.
}


export const PreviewButton: React.FC<PreviewProps> = ({name, school, onClick}) => {
    return (
        <>
        <button className='preview-button' onClick={onClick}>
                {name}
                <br></br>
                { school == "" ? <></> : <>({school})</>}
        </button>
        </>
    )
};

