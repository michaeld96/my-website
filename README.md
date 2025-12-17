# My Fullstack Blog

## EER
![EER](dev-blog/imgs/EER.svg)

## Development

To run frontend
```
cd frontend/src/website-frontend
npm run dev
```

To run database and populate it
```
docker compose up db migrator
```

To run backend
```
cd backend/src/API
dotnet run
```