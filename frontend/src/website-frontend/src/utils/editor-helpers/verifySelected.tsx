export const verifySelected = (
    selected: boolean, 
    errorMessage: string, 
    callBack: () => void) => {
        if (!selected)
        {
            alert(errorMessage);
        }
        else
        {
            callBack();
        }
    }