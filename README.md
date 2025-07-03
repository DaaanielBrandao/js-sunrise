Fullstack app to show sun information data by city and date.
Made by Daniel Brandão

---

## Backend (Rails)

```bash
cd sunrise-backend
bundle install
rails db:drop db:create db:migrate
rails cities:load
rails s
```

## Frontend (React Vite)
```bash
cd sunrise-frontend
npm install
npm run dev
```
Opens at: http://localhost:5173