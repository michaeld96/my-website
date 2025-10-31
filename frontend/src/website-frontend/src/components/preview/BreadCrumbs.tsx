import './BreadCrumb.css'
export default function BreadCrumb({ crumbs, onClickSchool, onClickSubject, onNoteClick }: 
    {crumbs: string[], onClickSchool: () => void, onClickSubject: () => void, onNoteClick: () => void}) {
    if (crumbs.length == 1) {
        return(
            <>
            <div className="breadcrumb-container">
                <button
                    className="breadcrumb" 
                    onClick={onClickSchool}
                >
                    {crumbs[0]}
                </button>
            </div>
            </>
        )
    }
    else if (crumbs.length == 2) {
        return(
            <>
            <div className="breadcrumb-container">
                <button
                    className="breadcrumb" 
                    onClick={onClickSchool}
                >
                    {crumbs[0]}
                </button>
                <div className="divider">
                    &gt;
                </div>
                <button
                    className="breadcrumb"
                    onClick={onClickSubject}
                >
                    {crumbs[1]}
                </button>
            </div>
            </>
        )
    }
    else if (crumbs.length == 3) {
        return(
            <>
            <div className="breadcrumb-container">
                <button
                    className="breadcrumb" 
                    onClick={onClickSchool}
                >
                    {crumbs[0]}
                </button>
                <div className="divider">
                    &gt;
                </div>
                <button
                    className="breadcrumb" 
                    onClick={onClickSubject}
                >
                    {crumbs[1]}
                </button>
                <div className="divider">
                    &gt;
                </div>
                <button
                    className="breadcrumb"
                    onClick={onNoteClick}
                >
                    {crumbs[2]}
                </button>
            </div>
            </>
        )
    }
    else {
        return (
            <a href="">{crumbs[0]}</a> > <a href="">{crumbs[1]}</a>
        )
    }
}