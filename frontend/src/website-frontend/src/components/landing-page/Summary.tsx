import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Summary.css'

interface SummaryProps {
    icon: IconDefinition;
    desc: string;
};

const Summary: React.FC<SummaryProps> = ({ icon, desc }) => {
    return (
        <div className="summary-container">
            <div className="summary-left">
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className="summary-right">
                <p dangerouslySetInnerHTML={{ __html: desc }}/>
            </div>
        </div>
    )
}

export default Summary;