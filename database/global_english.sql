-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: global_english
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `global_english`
--

/*!40000 DROP DATABASE IF EXISTS `global_english`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `global_english` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;

USE `global_english`;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alumnos` (
  `id_alumno` int(11) NOT NULL AUTO_INCREMENT,
  `dni` varchar(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_inscripcion` date NOT NULL,
  `motivo_baja` varchar(255) DEFAULT NULL,
  `fecha_baja` date DEFAULT NULL,
  PRIMARY KEY (`id_alumno`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES (1,'40111222','Juan','Perez',NULL,'1133445566','juan@gmail.com','activo','2025-03-01',NULL,NULL),(2,'40333444','Maria','Lopez',NULL,'1177889900','maria@gmail.com','activo','2025-03-01',NULL,NULL),(3,'40555666','Pedro','Sanchez',NULL,'1199001122','pedro@gmail.com','activo','2025-03-05',NULL,NULL),(4,'40777888','Ana','Fernandez',NULL,'1111223344','ana@gmail.com','activo','2025-03-10',NULL,NULL),(5,'40566822','Martin','Palermo',NULL,'3471605929','Martin445@gmail.com','activo','2026-06-16',NULL,NULL),(6,'46123321','Pablo','Peroni',NULL,'3471123443','pepe@gmail.com','activo','2026-06-22',NULL,NULL),(7,'46371961','Santiago Martin','Dardini',NULL,'3471605929','santiagodar2005@gmail.com','inactivo','2026-06-22','se graduó','2026-07-12'),(8,'45543345','Giovanni','Ibañez',NULL,'3464457876','gioiba@gmail.com','activo','2026-06-22',NULL,NULL),(9,'49122018','Josefina','Ludueña',NULL,'3415674321','Joselud@gmail.com','activo','2026-06-22',NULL,NULL),(10,'46300001','Juan Cruz','Gimenez',NULL,'3471525537','gimenezjuancruz44@gmail.com','activo','2026-06-22',NULL,NULL),(11,'45678987','Facundo','Bernini',NULL,'3471680109','facubernini@gmail.com','activo','2026-06-22',NULL,NULL),(12,'48817921','Rodolfo','Martinez',NULL,'3413401998','Rodom@gmail.com','activo','2026-06-22',NULL,NULL),(13,'47872199','Mariano','Rodriguez',NULL,'3464718922','marianor@gmail.com','activo','2026-06-23',NULL,NULL);
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asistencias` (
  `id_asistencia` int(11) NOT NULL AUTO_INCREMENT,
  `id_inscripcion` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `presente` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_asistencia`),
  KEY `id_inscripcion` (`id_inscripcion`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripciones` (`id_inscripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` VALUES (1,1,'2026-06-10',1),(2,1,'2026-06-11',1),(3,4,'2026-06-12',1),(4,1,'2026-06-12',1),(5,1,'2026-06-15',1),(6,2,'2026-06-15',0),(7,4,'2026-06-17',1),(8,1,'2026-06-17',1),(9,2,'2026-06-17',1),(10,4,'2026-06-21',1),(11,3,'2026-06-21',1),(12,5,'2026-06-21',1),(13,1,'2026-06-22',1),(14,6,'2026-06-22',1),(15,12,'2026-06-22',1),(16,1,'2026-06-23',1),(17,2,'2026-06-23',1),(18,11,'2026-06-23',1),(19,1,'2026-06-24',1),(20,6,'2026-06-24',1),(21,12,'2026-06-24',1),(22,4,'2026-06-23',1),(23,9,'2026-06-23',1),(24,1,'2026-07-11',1),(25,2,'2026-07-11',1),(27,4,'2026-07-11',1),(28,9,'2026-07-11',1),(29,3,'2026-07-12',1),(30,10,'2026-07-12',1),(31,8,'2026-07-12',1);
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cursos` (
  `id_curso` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `nivel` varchar(30) NOT NULL,
  `horario` varchar(50) DEFAULT NULL,
  `cuota_mensual` decimal(10,2) NOT NULL,
  `id_profesor` int(11) NOT NULL,
  PRIMARY KEY (`id_curso`),
  KEY `id_profesor` (`id_profesor`),
  CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`id_profesor`) REFERENCES `profesores` (`id_profesor`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,'Curso 1','Principiante','Lunes y Miércoles 18:00',5000.00,1),(2,'Curso 2','Intermedio','Martes y Jueves 19:00',6000.00,2),(3,'Curso 3','Avanzado','Viernes 17:00',7000.00,1);
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inscripciones` (
  `id_inscripcion` int(11) NOT NULL AUTO_INCREMENT,
  `id_alumno` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `fecha_inscripcion` date NOT NULL,
  PRIMARY KEY (`id_inscripcion`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos` (`id_alumno`),
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
INSERT INTO `inscripciones` VALUES (1,1,1,'2026-06-16'),(2,2,1,'2025-03-01'),(3,3,2,'2025-03-05'),(4,4,3,'2025-03-10'),(5,5,2,'2026-06-16'),(6,6,1,'2026-06-22'),(8,8,2,'2026-06-22'),(9,9,3,'2026-06-22'),(10,10,2,'2026-06-22'),(11,11,1,'2026-06-22'),(12,12,1,'2026-06-22'),(13,13,3,'2026-06-23');
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listas_asistencia`
--

DROP TABLE IF EXISTS `listas_asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listas_asistencia` (
  `id_lista` int(11) NOT NULL AUTO_INCREMENT,
  `id_curso` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `cerrada` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_cierre` datetime DEFAULT NULL,
  PRIMARY KEY (`id_lista`),
  UNIQUE KEY `id_curso` (`id_curso`,`fecha`),
  CONSTRAINT `listas_asistencia_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listas_asistencia`
--

LOCK TABLES `listas_asistencia` WRITE;
/*!40000 ALTER TABLE `listas_asistencia` DISABLE KEYS */;
INSERT INTO `listas_asistencia` VALUES (1,1,'2026-06-15',1,'2026-06-15 18:27:30'),(2,3,'2026-06-17',1,'2026-06-17 22:06:59'),(3,1,'2026-06-17',1,'2026-06-17 22:56:39'),(4,3,'2026-06-21',1,'2026-06-21 13:43:20'),(5,2,'2026-06-21',1,'2026-06-21 19:37:19'),(6,1,'2026-06-22',1,'2026-06-22 23:14:39'),(7,1,'2026-06-23',1,'2026-06-23 20:53:07'),(8,1,'2026-06-24',1,'2026-06-23 22:15:11'),(9,3,'2026-06-23',1,'2026-06-23 22:32:44'),(10,1,'2026-07-11',1,'2026-07-11 18:34:20'),(11,2,'2026-07-12',1,'2026-07-12 19:10:01');
/*!40000 ALTER TABLE `listas_asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_inscripcion` int(11) NOT NULL,
  `mes_correspondiente` varchar(7) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `estado` enum('pagado','pendiente','vencido') NOT NULL DEFAULT 'pendiente',
  `pagado_por` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_inscripcion` (`id_inscripcion`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripciones` (`id_inscripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,'2025-03',5000.00,'2025-03-05','pagado',NULL),(2,2,'2025-03',5000.00,'2025-03-06','pagado',NULL),(3,3,'2025-03',6000.00,'2025-03-07','pagado',NULL),(4,1,'2025-04',5000.00,'2025-04-03','pagado',NULL),(5,3,'2025-04',6000.00,'2025-04-05','pagado',NULL),(6,1,'2026-06',5000.00,'2026-06-16','pagado',NULL),(7,5,'2026-06',6000.00,'2026-06-16','pagado',NULL),(8,3,'2026-06',6000.00,'2026-06-17','pagado',NULL),(9,3,'2025-05',6000.00,'2026-06-19','pagado',NULL),(11,4,'2025-03',7000.00,'2026-06-20','pagado',NULL),(12,2,'2025-04',5000.00,'2026-06-21','pagado',NULL),(13,4,'2025-04',7000.00,'2026-06-21','pagado',NULL),(14,4,'2025-05',7000.00,'2026-06-21','pagado',NULL),(15,2,'2025-05',5000.00,'2026-06-21','pagado',NULL),(16,2,'2025-06',5000.00,'2026-06-21','pagado','Maria Lopez'),(17,2,'2025-07',5000.00,'2026-06-22','pagado','Mama de Maria'),(19,6,'2026-06',5000.00,'2026-06-22','pagado','elpepe'),(20,10,'2026-06',6000.00,'2026-06-22','pagado','Juancrucito (Goat)'),(21,11,'2026-06',5000.00,'2026-06-22','pagado','Mama de Facundo'),(22,2,'2025-08',5000.00,'2026-06-23','pagado','Alumno'),(23,2,'2025-09',5000.00,'2026-06-23','pagado','Alumno'),(24,12,'2026-06',5000.00,'2026-06-24','pagado','Rodolfo'),(26,2,'2025-02',5000.00,'2026-06-24','pagado','Maria'),(27,2,'2025-10',5000.00,'2026-07-09','pagado','Maria'),(28,2,'2025-11',5000.00,'2026-07-09','pagado','Maria'),(29,2,'2025-12',5000.00,'2026-07-09','pagado','Maria'),(30,3,'2025-06',6000.00,'2026-07-09','pagado','Pedro'),(31,3,'2025-07',6000.00,'2026-07-09','pagado','Pedro'),(32,3,'2025-08',6000.00,'2026-07-09','pagado','Pedro'),(33,3,'2025-09',6000.00,'2026-07-09','pagado',NULL),(34,3,'2025-10',6000.00,'2026-07-09','pagado',NULL),(35,3,'2025-11',6000.00,'2026-07-09','pagado',NULL),(36,2,'2026-01',5000.00,'2026-07-09','pagado','Maria'),(37,2,'2026-02',5000.00,'2026-07-09','pagado','Mama de Maria'),(38,5,'2026-07',6000.00,'2026-07-11','pagado','Martin'),(39,6,'2026-07',5000.00,'2026-07-12','pagado','Alumno');
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesores`
--

DROP TABLE IF EXISTS `profesores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profesores` (
  `id_profesor` int(11) NOT NULL AUTO_INCREMENT,
  `dni` varchar(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id_profesor`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores`
--

LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
INSERT INTO `profesores` VALUES (1,'20111222','Laura','Gomez','1122334455','laura@gmail.com','activo'),(2,'20333444','Carlos','Martinez','1166778899','carlos@gmail.com','activo'),(7,'32569965','Fabian','Ramirez','3471258963','FabianRa@gmail.com','inactivo');
/*!40000 ALTER TABLE `profesores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('secretaria','profesor') NOT NULL,
  `id_profesor` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `id_profesor` (`id_profesor`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_profesor`) REFERENCES `profesores` (`id_profesor`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'secretaria','$2b$10$tX2CNOkJcKAtmAIC1Zfc.e3KSIngqnOTviAfrU5IEicyVUSN52rRm','secretaria',NULL),(2,'laura','$2b$10$.6BpdA8ZITo20a7lLGqwrOXwVguV4e4.jvVbL97TOQ/m1tLGnheoO','profesor',1),(3,'carlos','$2b$10$wIJ4MsJuDDABPYKR20VfSe0IivdWi47loR7G3..Gt9.6u.xpf5JJW','profesor',2),(6,'fabian','$2b$10$xOMVrsVeR9.JY2c3d9TMdegsqJEe9zKKxprYWhMCmjqoMJIaK3CFq','profesor',7);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 15:48:39
