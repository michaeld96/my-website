import './button.css'
interface PreviewProps {
    name: string
    school: string
}


export const PreviewButton: React.FC<PreviewProps> = ({name, school}) => {
    return (
        <>
        <button className='preview-button'>
                {name}
                <br></br>
                ({school})
        </button>
        </>
    )
};

