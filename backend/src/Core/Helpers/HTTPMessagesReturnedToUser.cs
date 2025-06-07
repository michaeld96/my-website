using System;

namespace Core.Helpers;

public static class HTTPMessagesReturnedToUser
{
    public static string SchoolNotFoundErrorMessage(string schoolCode)
    {
        return $"ERROR: School, {schoolCode}, does not exists.";
    }
    public static string SchoolNotSpecifiedErrorMessage()
    {
        return "ERROR: No school was specified.";
    }
}
