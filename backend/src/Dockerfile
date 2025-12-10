FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# Set the working directory for all the commands that proceed.
WORKDIR /src 

COPY ["API/API.csproj", "API/"]
COPY ["Core/Core.csproj", "Core/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]

RUN dotnet restore "API/API.csproj"

COPY . .

RUN dotnet publish "API/API.csproj" -c Release -o /app/publish

# Building a slimmer image to run the application.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Copy published output from build stage.
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT [ "dotnet", "API.dll" ]