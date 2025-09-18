import './BreadCrumb.css'
export default function BreadCrumb({ crumbs, onClick }: {crumbs: string[], onClick: () => void}) {
    if (crumbs.length == 1) {
        return(
            <>
            <div className="breadcrumb-container">
                <button
                    className="breadcrumb" 
                    onClick={onClick}
                >
                    {crumbs[0]}
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