-- --------------------------------------------------------
-- 主机:                           aws.connect.psdb.cloud
-- 服务器版本:                        8.0.23-Vitess
-- 服务器操作系统:                      Linux
-- HeidiSQL 版本:                  12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 正在导出表  jerrywu001.User 的数据：~1 rows (大约)
DELETE FROM `User`;
INSERT INTO `User` (`userId`, `email`, `role`, `nickname`, `description`, `job`, `homepage`, `avatar`, `cover`, `createdAt`, `updatedAt`) VALUES
	('cf68574a-8929-43b0-a6e3-f185e4c2295a', '57242263@163.com', 'USER', 'jerrywu001', NULL, NULL, NULL, 'https://ik.imagekit.io/jerrywu001/supabases/cf68574a-8929-43b0-a6e3-f185e4c2295a', NULL, '2023-09-21 06:52:44.308', '2023-09-21 06:52:51.055');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
