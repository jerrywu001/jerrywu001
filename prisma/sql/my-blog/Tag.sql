-- --------------------------------------------------------
-- 主机:                           db.gubmvddvhbjtzccvygpu.supabase.co
-- 服务器版本:                        PostgreSQL 15.1 (Ubuntu 15.1-1.pgdg20.04+1) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 9.4.0-1ubuntu1~20.04.1) 9.4.0, 64-bit
-- 服务器操作系统:                      
-- HeidiSQL 版本:                  12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 导出  表 public.Tag 结构
DROP TABLE IF EXISTS "Tag";
CREATE TABLE IF NOT EXISTS "Tag" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	PRIMARY KEY ("id"),
	UNIQUE INDEX "Tag_id_key" ("id"),
	UNIQUE INDEX "Tag_name_key" ("name")
);

-- 正在导出表  public.Tag 的数据：-1 rows
DELETE FROM "Tag";
/*!40000 ALTER TABLE "Tag" DISABLE KEYS */;
INSERT INTO "Tag" ("id", "name") VALUES
	('7920693c-f444-4adf-b784-63d91a7428c6', 'react'),
	('7cb86e4f-ba97-4548-944a-50dbde6c8e5d', 'vue'),
	('add475d2-0396-4f54-af5b-af69aec30256', 'nodejs'),
	('c0659372-a1c4-49c3-b30d-959c8d7115a4', 'babel'),
	('54612013-cb22-4ba7-a9c4-e53f7575258c', 'markdown'),
	('e31e4431-88c8-4325-a535-a801758d4c26', 'source-code'),
	('2ed0bba6-cfee-4104-bf03-401a11d76ac3', 'unit-test'),
	('cda43fe2-e587-43d0-810f-59995cc3d217', 'mocker'),
	('ef14f02e-cc28-4fb4-a142-2e23a87f45da', 'database'),
	('659147ae-0e16-4123-a7ea-afe150cb2ac4', 'orm'),
	('c27305d6-3b6e-452a-baa9-14786bdbcdb5', 'vite'),
	('948ec044-8098-4f6a-9b9f-90ba70c1a14d', 'interview'),
	('09799668-e217-489b-aa98-a96022a943e4', 'linter'),
	('15339136-b5cb-4dfc-8ad9-a8a6ad9c8523', 'html'),
	('9c83870b-d999-43a3-9b51-6de4f1bfbcf7', 'npm'),
	('8fd505fd-d36b-4d6d-afec-20651defd064', 'vscode'),
	('84f61274-ce3c-4e41-ae32-c57063cadaff', 'typescript'),
	('ecc06f20-6a13-4c21-a07d-9bdac0eaac2f', 'javascript'),
	('f33cb15d-445f-459c-9bdc-e41dfe6cc8dd', 'css'),
	('565a24a3-64b6-4047-9fb8-40c4c21a1b8d', 'animation'),
	('f412aa37-8fdc-41a4-a4f7-0b7747a6cb4b', 'bun'),
	('44a986df-4c1c-4c5a-a94b-23fc63a9a4fd', 'linux');
/*!40000 ALTER TABLE "Tag" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
