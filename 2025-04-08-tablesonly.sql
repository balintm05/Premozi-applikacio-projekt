-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2025 at 10:37 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `email2facodes`
--

CREATE TABLE `email2facodes` (
  `Id` int(11) NOT NULL,
  `Code` longtext NOT NULL,
  `UserID` int(11) NOT NULL,
  `ExpiresAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `film`
--

CREATE TABLE `film` (
  `id` int(11) NOT NULL,
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
  `Megjegyzes` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foglalasadatok`
--

CREATE TABLE `foglalasadatok` (
  `id` int(11) NOT NULL,
  `FoglalasIdopontja` datetime(6) NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foglaltszekek`
--

CREATE TABLE `foglaltszekek` (
  `Vetitesid` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `FoglalasAdatokid` int(11) NOT NULL,
  `JegyTipusId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `httplogs`
--

CREATE TABLE `httplogs` (
  `Id` int(11) NOT NULL,
  `Schema` longtext NOT NULL,
  `Host` longtext NOT NULL,
  `Path` longtext NOT NULL,
  `QueryString` longtext NOT NULL,
  `RequestHeaders` longtext NOT NULL,
  `RequestBody` longtext NOT NULL,
  `ResponseHeaders` longtext NOT NULL,
  `ResponseBody` longtext NOT NULL,
  `StatusCode` int(11) NOT NULL,
  `LogTime` datetime(6) NOT NULL DEFAULT utc_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `Id` int(11) NOT NULL,
  `RelativePath` longtext NOT NULL,
  `FileName` longtext NOT NULL,
  `OriginalFileName` longtext NOT NULL,
  `ContentType` longtext NOT NULL,
  `FileSize` bigint(20) NOT NULL,
  `UploadDate` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jegytipus`
--

CREATE TABLE `jegytipus` (
  `id` int(11) NOT NULL,
  `Nev` longtext NOT NULL,
  `Ar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `szekek`
--

CREATE TABLE `szekek` (
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `Teremid` int(11) NOT NULL,
  `Allapot` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `terem`
--

CREATE TABLE `terem` (
  `id` int(11) NOT NULL,
  `Nev` longtext NOT NULL,
  `Megjegyzes` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
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
  `PasswordResetRequired` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vetites`
--

CREATE TABLE `vetites` (
  `id` int(11) NOT NULL,
  `Idopont` datetime(6) NOT NULL,
  `Megjegyzes` longtext NOT NULL,
  `Filmid` int(11) NOT NULL,
  `Teremid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vetitesszekek`
--

CREATE TABLE `vetitesszekek` (
  `Vetitesid` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `FoglalasAllapot` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email2facodes`
--
ALTER TABLE `email2facodes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Email2FACodes_UserID` (`UserID`);

--
-- Indexes for table `film`
--
ALTER TABLE `film`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IX_Film_ImageID` (`ImageID`);

--
-- Indexes for table `foglalasadatok`
--
ALTER TABLE `foglalasadatok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IX_FoglalasAdatok_UserID` (`UserID`);

--
-- Indexes for table `foglaltszekek`
--
ALTER TABLE `foglaltszekek`
  ADD PRIMARY KEY (`FoglalasAdatokid`,`Vetitesid`,`X`,`Y`),
  ADD UNIQUE KEY `IX_FoglaltSzekek_Vetitesid_X_Y` (`Vetitesid`,`X`,`Y`),
  ADD KEY `IX_FoglaltSzekek_JegyTipusId` (`JegyTipusId`);

--
-- Indexes for table `httplogs`
--
ALTER TABLE `httplogs`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `jegytipus`
--
ALTER TABLE `jegytipus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `szekek`
--
ALTER TABLE `szekek`
  ADD PRIMARY KEY (`Teremid`,`X`,`Y`);

--
-- Indexes for table `terem`
--
ALTER TABLE `terem`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `IX_Users_email` (`email`),
  ADD UNIQUE KEY `IX_Users_refreshToken` (`refreshToken`);

--
-- Indexes for table `vetites`
--
ALTER TABLE `vetites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IX_Vetites_Filmid` (`Filmid`),
  ADD KEY `IX_Vetites_Teremid` (`Teremid`);

--
-- Indexes for table `vetitesszekek`
--
ALTER TABLE `vetitesszekek`
  ADD PRIMARY KEY (`Vetitesid`,`X`,`Y`);

--
-- Indexes for table `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email2facodes`
--
ALTER TABLE `email2facodes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `film`
--
ALTER TABLE `film`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `foglalasadatok`
--
ALTER TABLE `foglalasadatok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `httplogs`
--
ALTER TABLE `httplogs`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jegytipus`
--
ALTER TABLE `jegytipus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `terem`
--
ALTER TABLE `terem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vetites`
--
ALTER TABLE `vetites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
