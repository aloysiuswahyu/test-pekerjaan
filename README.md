# Project Name

Deskripsi singkat project Anda.

Repository ini terdiri dari 2 bagian utama:

- `backend` → REST API menggunakan CodeIgniter 4 + MySQL
- `frontend` → Aplikasi frontend menggunakan Next.js

---

# Struktur Folder

```bash
project-root/
│
├── backend/     # API CodeIgniter 4
└── frontend/    # Frontend Next.js
```

---

# Requirement

Pastikan sudah menginstall:

- PHP >= 8.3
- Composer
- MySQL
- Node.js >= 26
- NPM 

---

# Instalasi Backend (CodeIgniter 4)

Masuk ke folder backend:

```bash
cd backend
```

## 1. Install Dependency

```bash
composer install
```

## 2. Konfigurasi Environment

Copy file `env` menjadi `.env`

```bash
cp env .env
```

Atur konfigurasi database pada file `.env`

```env
database.default.hostname = localhost
database.default.database = nama_database
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
database.default.port = 3306
```

---

## 3. Jalankan Migration

```bash
php spark migrate
```

---

## 4. Jalankan Seeder

```bash
php spark db:seed UserSeeder
```


---

## 5. Menjalankan Backend

```bash
php spark serve
```

Backend akan berjalan di:

```bash
http://localhost:8080
```

---

# Instalasi Frontend (Next.js)

Masuk ke folder frontend:

```bash
cd frontend
```

## 1. Install Dependency

```bash
npm install
```

atau

```bash
yarn install
```

---

## 2. Konfigurasi Environment

Buat file `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 3. Menjalankan Frontend

```bash
npm run dev
```

atau

```bash
yarn dev
```

Frontend akan berjalan di:

```bash
http://localhost:3000
```

---

# Alur Menjalankan Project

## Jalankan Backend terlebih dahulu

```bash
cd backend
php spark serve
```

## Jalankan Frontend

```bash
cd frontend
npm run dev
```

---

# Teknologi yang Digunakan

## Backend

- CodeIgniter 4
- PHP
- MySQL

## Frontend

- Next.js
- React.js
- bosstrap CSS

---

# Catatan

- Pastikan MySQL sudah berjalan sebelum migrate.
- Pastikan URL API pada frontend sesuai dengan backend.
- Gunakan versi Node.js dan PHP yang kompatibel.

---

# License

MIT License