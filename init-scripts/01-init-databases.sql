-- ============================================================================
-- Инициализация БД для микросервисов (accounts + calendar)
-- Работает при первом запуске PostgreSQL в Docker
-- Миграции выполняются от postgres, runtime — от ограниченных пользователей
-- ============================================================================

-- Создаём пользователей (замените пароли на свои!)
CREATE USER accounts_user WITH PASSWORD 'accounts_pass';
CREATE USER calendar_user WITH PASSWORD 'calendar_pass';

-- Создаём базы данных
CREATE DATABASE accounts_db;
CREATE DATABASE calendar_db;

-- ============================================================================
-- НАСТРОЙКА accounts_db
-- ============================================================================
\c accounts_db

-- Отзываем все публичные права
REVOKE ALL ON DATABASE accounts_db FROM PUBLIC;

-- Разрешаем подключение целевому пользователю
GRANT CONNECT ON DATABASE accounts_db TO accounts_user;

-- Права на схему
GRANT USAGE ON SCHEMA public TO accounts_user;

-- Права на ВСЕ существующие таблицы и последовательности (на случай, если миграции уже были)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO accounts_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO accounts_user;

-- 🔑 КЛЮЧЕВОЕ: автоматические права для ВСЕХ БУДУЩИХ таблиц,
-- создаваемых postgres (потому что миграции идут от него!)
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO accounts_user;

ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO accounts_user;

-- (Функции обычно не нужны Prisma, но на всякий случай)
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public
    GRANT EXECUTE ON FUNCTIONS TO accounts_user;

-- ============================================================================
-- НАСТРОЙКА calendar_db
-- ============================================================================
\c calendar_db

REVOKE ALL ON DATABASE calendar_db FROM PUBLIC;

GRANT CONNECT ON DATABASE calendar_db TO calendar_user;
GRANT USAGE ON SCHEMA public TO calendar_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO calendar_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO calendar_user;

ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO calendar_user;

ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO calendar_user;

ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public
    GRANT EXECUTE ON FUNCTIONS TO calendar_user;