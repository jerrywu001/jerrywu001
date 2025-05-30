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

-- 导出  表 public.Like 结构
DROP TABLE IF EXISTS "Like";
CREATE TABLE IF NOT EXISTS "Like" (
	"id" TEXT NOT NULL,
	"occurrenceAt" TIMESTAMP NULL DEFAULT 'CURRENT_TIMESTAMP',
	"blogId" TEXT NOT NULL,
	"uid" TEXT NOT NULL,
	PRIMARY KEY ("id"),
	UNIQUE INDEX "Like_id_key" ("id"),
	CONSTRAINT "Like_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Post" ("postId") ON UPDATE CASCADE ON DELETE RESTRICT,
	CONSTRAINT "Like_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("userId") ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 正在导出表  public.Like 的数据：-1 rows
DELETE FROM "Like";
/*!40000 ALTER TABLE "Like" DISABLE KEYS */;
/*!40000 ALTER TABLE "Like" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
