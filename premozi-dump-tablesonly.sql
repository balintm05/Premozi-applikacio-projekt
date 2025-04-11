-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2025 at 09:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `premozi`
--
CREATE DATABASE IF NOT EXISTS `premozi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `premozi`;

-- --------------------------------------------------------

--
-- Table structure for table `email2facodes`
--

DROP TABLE IF EXISTS `email2facodes`;
CREATE TABLE IF NOT EXISTS `email2facodes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Code` longtext NOT NULL,
  `UserID` int(11) NOT NULL,
  `ExpiresAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Email2FACodes_UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `film`
--

DROP TABLE IF EXISTS `film`;
CREATE TABLE IF NOT EXISTS `film` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Cim` longtext NOT NULL,
  `Kategoria` longtext NOT NULL,
  `Mufaj` longtext NOT NULL,
  `Korhatar` longtext NOT NULL,
  `Jatekido` int(11) NOT NULL,
  `Gyarto` longtext NOT NULL,
  `Rendezo` longtext NOT NULL,
  `Szereplok` longtext NOT NULL,
  `Leiras` longtext NOT NULL,
  `EredetiNyelv` longtext NOT NULL,
  `EredetiCim` longtext NOT NULL,
  `Szinkron` longtext NOT NULL,
  `TrailerLink` longtext NOT NULL,
  `IMDB` longtext NOT NULL,
  `ImageID` int(11) NOT NULL,
  `Megjegyzes` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_Film_ImageID` (`ImageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foglalasadatok`
--

DROP TABLE IF EXISTS `foglalasadatok`;
CREATE TABLE IF NOT EXISTS `foglalasadatok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `FoglalasIdopontja` datetime(6) NOT NULL,
  `UserID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_FoglalasAdatok_UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foglaltszekek`
--

DROP TABLE IF EXISTS `foglaltszekek`;
CREATE TABLE IF NOT EXISTS `foglaltszekek` (
  `Vetitesid` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `FoglalasAdatokid` int(11) NOT NULL,
  `JegyTipusId` int(11) NOT NULL,
  PRIMARY KEY (`FoglalasAdatokid`,`Vetitesid`,`X`,`Y`),
  UNIQUE KEY `IX_FoglaltSzekek_Vetitesid_X_Y` (`Vetitesid`,`X`,`Y`),
  KEY `IX_FoglaltSzekek_JegyTipusId` (`JegyTipusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `httplogs`
--

DROP TABLE IF EXISTS `httplogs`;
CREATE TABLE IF NOT EXISTS `httplogs` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Schema` longtext NOT NULL,
  `Host` longtext NOT NULL,
  `Path` longtext NOT NULL,
  `QueryString` longtext NOT NULL,
  `RequestHeaders` longtext NOT NULL,
  `RequestBody` longtext NOT NULL,
  `ResponseHeaders` longtext NOT NULL,
  `ResponseBody` longtext NOT NULL,
  `StatusCode` int(11) NOT NULL,
  `LogTime` datetime(6) NOT NULL DEFAULT utc_timestamp(),
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
CREATE TABLE IF NOT EXISTS `images` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RelativePath` longtext NOT NULL,
  `FileName` longtext NOT NULL,
  `OriginalFileName` longtext NOT NULL,
  `ContentType` longtext NOT NULL,
  `FileSize` bigint(20) NOT NULL,
  `UploadDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jegytipus`
--

DROP TABLE IF EXISTS `jegytipus`;
CREATE TABLE IF NOT EXISTS `jegytipus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Nev` longtext NOT NULL,
  `Ar` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `szekek`
--

DROP TABLE IF EXISTS `szekek`;
CREATE TABLE IF NOT EXISTS `szekek` (
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `Teremid` int(11) NOT NULL,
  `Allapot` int(11) NOT NULL,
  PRIMARY KEY (`Teremid`,`X`,`Y`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `terem`
--

DROP TABLE IF EXISTS `terem`;
CREATE TABLE IF NOT EXISTS `terem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Nev` longtext NOT NULL,
  `Megjegyzes` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `passwordHash` char(84) NOT NULL,
  `creationDate` datetime NOT NULL,
  `accountStatus` int(1) NOT NULL,
  `role` varchar(30) NOT NULL,
  `Megjegyzes` longtext NOT NULL,
  `refreshToken` varchar(100) DEFAULT NULL,
  `refreshTokenExpiry` datetime DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `EmailConfirmationToken` longtext DEFAULT NULL,
  `EmailConfirmationTokenExpiry` datetime(6) DEFAULT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `PasswordResetToken` longtext DEFAULT NULL,
  `PasswordResetTokenExpiry` datetime(6) DEFAULT NULL,
  `PasswordResetRequired` tinyint(1) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `IX_Users_email` (`email`),
  UNIQUE KEY `IX_Users_refreshToken` (`refreshToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vetites`
--

DROP TABLE IF EXISTS `vetites`;
CREATE TABLE IF NOT EXISTS `vetites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Idopont` datetime(6) NOT NULL,
  `Megjegyzes` longtext NOT NULL,
  `Filmid` int(11) NOT NULL,
  `Teremid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_Vetites_Filmid` (`Filmid`),
  KEY `IX_Vetites_Teremid` (`Teremid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vetitesszekek`
--

DROP TABLE IF EXISTS `vetitesszekek`;
CREATE TABLE IF NOT EXISTS `vetitesszekek` (
  `Vetitesid` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `FoglalasAllapot` int(11) NOT NULL,
  PRIMARY KEY (`Vetitesid`,`X`,`Y`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
CREATE TABLE IF NOT EXISTS `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email2facodes`
--
ALTER TABLE `email2facodes`
  ADD CONSTRAINT `FK_Email2FACodes_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `film`
--
ALTER TABLE `film`
  ADD CONSTRAINT `FK_Film_Images_ImageID` FOREIGN KEY (`ImageID`) REFERENCES `images` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `foglalasadatok`
--
ALTER TABLE `foglalasadatok`
  ADD CONSTRAINT `FK_FoglalasAdatok_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `foglaltszekek`
--
ALTER TABLE `foglaltszekek`
  ADD CONSTRAINT `FK_FoglaltSzekek_FoglalasAdatok_FoglalasAdatokid` FOREIGN KEY (`FoglalasAdatokid`) REFERENCES `foglalasadatok` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_FoglaltSzekek_JegyTipus_JegyTipusId` FOREIGN KEY (`JegyTipusId`) REFERENCES `jegytipus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_FoglaltSzekek_VetitesSzekek_Vetitesid_X_Y` FOREIGN KEY (`Vetitesid`,`X`,`Y`) REFERENCES `vetitesszekek` (`Vetitesid`, `X`, `Y`) ON DELETE CASCADE;

--
-- Constraints for table `szekek`
--
ALTER TABLE `szekek`
  ADD CONSTRAINT `FK_Szekek_Terem_Teremid` FOREIGN KEY (`Teremid`) REFERENCES `terem` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vetites`
--
ALTER TABLE `vetites`
  ADD CONSTRAINT `FK_Vetites_Film_Filmid` FOREIGN KEY (`Filmid`) REFERENCES `film` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Vetites_Terem_Teremid` FOREIGN KEY (`Teremid`) REFERENCES `terem` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vetitesszekek`
--
ALTER TABLE `vetitesszekek`
  ADD CONSTRAINT `FK_VetitesSzekek_Vetites_Vetitesid` FOREIGN KEY (`Vetitesid`) REFERENCES `vetites` (`id`) ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
