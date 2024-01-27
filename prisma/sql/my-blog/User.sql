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

-- 导出  表 public.User 结构
DROP TABLE IF EXISTS "User";
CREATE TABLE IF NOT EXISTS "User" (
	"userId" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"role" UNKNOWN NULL DEFAULT 'USER',
	"nickname" TEXT NULL DEFAULT NULL,
	"description" TEXT NULL DEFAULT NULL,
	"job" TEXT NULL DEFAULT NULL,
	"homepage" TEXT NULL DEFAULT NULL,
	"avatar" TEXT NULL DEFAULT NULL,
	"cover" TEXT NULL DEFAULT NULL,
	"createdAt" TIMESTAMP NULL DEFAULT 'CURRENT_TIMESTAMP',
	"updatedAt" TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY ("userId"),
	UNIQUE INDEX "User_userId_key" ("userId"),
	UNIQUE INDEX "User_email_key" ("email")
);

-- 正在导出表  public.User 的数据：-1 rows
DELETE FROM "User";
/*!40000 ALTER TABLE "User" DISABLE KEYS */;
INSERT INTO "User" ("userId", "email", "role", "nickname", "description", "job", "homepage", "avatar", "cover", "createdAt", "updatedAt") VALUES
	('cf68574a-8929-43b0-a6e3-f185e4c2295a', '57242263@163.com', 'ADMIN', 'jerrywu001', NULL, NULL, NULL, 'https://ik.imagekit.io/jerrywu001/supabases/cf68574a-8929-43b0-a6e3-f185e4c2295a', NULL, '2023-09-01 07:02:08.578', '2023-09-01 07:02:11.321'),
	('a444d097-ebd0-4dcd-b54c-6132d93a28c4', 'jerrywu001@gmail.com', 'USER', 'Jerry wu', NULL, NULL, NULL, 'https://ik.imagekit.io/jerrywu001/supabases/a444d097-ebd0-4dcd-b54c-6132d93a28c4', NULL, '2023-10-30 07:46:37.129', '2023-10-30 07:46:37.129');
/*!40000 ALTER TABLE "User" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
