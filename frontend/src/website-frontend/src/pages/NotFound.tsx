import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './NotFound.css'

const NotFound: React.FC = () => {
    return (
        <div className="four-oh-four">
            <div className="icon">
                <FontAwesomeIcon icon={faGhost}/>
            </div>
            <h1>404</h1>
            <h1>The page you are looking for doesn't exist</h1>
            <div className="landing-page-button">
                    <a href='/'>
                        Return to the Homepage
                    </a>
            </div>
        </div>
    );
}

export default NotFound;