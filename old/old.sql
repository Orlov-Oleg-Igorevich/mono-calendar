-- ============================================================================
-- Безопасная инициализация БД для микросервисов
-- PostgreSQL 12+ | Работает в Docker
-- ============================================================================

-- Создаём пользователей (пароли замените на свои!)
CREATE USER accounts_user WITH PASSWORD 'accounts_pass';
CREATE USER calendar_user WITH PASSWORD 'calendar_pass';

-- Создаём базы данных
CREATE DATABASE accounts_db;
CREATE DATABASE calendar_db;

-- ============================================================================
-- НАСТРОЙКА accounts_db
-- ============================================================================
\c accounts_db

-- 1. Полностью отключаем PUBLIC (все пользователи)
REVOKE ALL ON DATABASE accounts_db FROM PUBLIC;

-- 2. Даём ТОЛЬКО нужные права пользователю
GRANT CONNECT ON DATABASE accounts_db TO accounts_user;
GRANT CREATE ON DATABASE accounts_db TO accounts_user;  -- Нужно для миграций Prisma

-- 3. Настраиваем схему public
ALTER SCHEMA public OWNER TO accounts_user;
GRANT ALL ON SCHEMA public TO accounts_user;

-- 4. Автоматические права для новых объектов (таблиц, последовательностей)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO accounts_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO accounts_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO accounts_user;

-- ============================================================================
-- НАСТРОЙКА calendar_db
-- ============================================================================
\c calendar_db

-- 1. Полностью отключаем PUBLIC (все пользователи)
REVOKE ALL ON DATABASE calendar_db FROM PUBLIC;

-- 2. Даём ТОЛЬКО нужные права пользователю
GRANT CONNECT ON DATABASE calendar_db TO calendar_user;
GRANT CREATE ON DATABASE calendar_db TO calendar_user;  -- Нужно для миграций Prisma

-- 3. Настраиваем схему public
ALTER SCHEMA public OWNER TO calendar_user;
GRANT ALL ON SCHEMA public TO calendar_user;

-- 4. Автоматические права для новых объектов
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO calendar_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO calendar_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO calendar_user;

