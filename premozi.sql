-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2025 at 11:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `film`
--

CREATE TABLE `film` (
  `id` int(11) NOT NULL,
  `Cim` text NOT NULL,
  `Kategoria` text NOT NULL,
  `Mufaj` text NOT NULL,
  `Korhatar` text NOT NULL,
  `Jatekido` int(4) NOT NULL,
  `Gyarto` text NOT NULL,
  `Rendezo` text NOT NULL,
  `Szereplok` text NOT NULL,
  `Leiras` text NOT NULL,
  `EredetiNyelv` text NOT NULL,
  `EredetiCim` text NOT NULL,
  `Szinkron` text NOT NULL,
  `TrailerLink` text NOT NULL,
  `IMDB` text NOT NULL,
  `AlapAr` int(11) NOT NULL,
  `Megjegyzes` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foglalasadatok`
--

CREATE TABLE `foglalasadatok` (
  `id` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `FoglalasIdopontja` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foglaltszekek`
--

CREATE TABLE `foglaltszekek` (
  `Teremid` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `Vetitesid` int(11) NOT NULL,
  `FoglalasAdatokid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `szekek`
--

CREATE TABLE `szekek` (
  `Teremid` int(5) NOT NULL,
  `X` int(2) NOT NULL,
  `Y` int(2) NOT NULL,
  `Allapot` int(1) NOT NULL,
  `Megjegyzes` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `szekek`
--

INSERT INTO `szekek` (`Teremid`, `X`, `Y`, `Allapot`, `Megjegyzes`) VALUES
(1, 0, 0, 1, ''),
(1, 0, 1, 1, ''),
(1, 0, 2, 1, ''),
(1, 0, 3, 1, ''),
(1, 0, 4, 1, ''),
(1, 0, 5, 1, ''),
(1, 0, 6, 1, ''),
(1, 0, 7, 1, ''),
(1, 0, 8, 1, ''),
(1, 0, 9, 1, ''),
(1, 0, 10, 1, ''),
(1, 0, 11, 1, ''),
(1, 0, 12, 1, ''),
(1, 0, 13, 1, ''),
(1, 0, 14, 1, ''),
(1, 1, 0, 1, ''),
(1, 1, 1, 1, ''),
(1, 1, 2, 1, ''),
(1, 1, 3, 1, ''),
(1, 1, 4, 1, ''),
(1, 1, 5, 1, ''),
(1, 1, 6, 1, ''),
(1, 1, 7, 1, ''),
(1, 1, 8, 1, ''),
(1, 1, 9, 1, ''),
(1, 1, 10, 1, ''),
(1, 1, 11, 1, ''),
(1, 1, 12, 1, ''),
(1, 1, 13, 1, ''),
(1, 1, 14, 1, ''),
(1, 2, 0, 1, ''),
(1, 2, 1, 1, ''),
(1, 2, 2, 1, ''),
(1, 2, 3, 1, ''),
(1, 2, 4, 1, ''),
(1, 2, 5, 1, ''),
(1, 2, 6, 1, ''),
(1, 2, 7, 1, ''),
(1, 2, 8, 1, ''),
(1, 2, 9, 1, ''),
(1, 2, 10, 1, ''),
(1, 2, 11, 1, ''),
(1, 2, 12, 1, ''),
(1, 2, 13, 1, ''),
(1, 2, 14, 1, ''),
(1, 3, 0, 1, ''),
(1, 3, 1, 1, ''),
(1, 3, 2, 1, ''),
(1, 3, 3, 1, ''),
(1, 3, 4, 1, ''),
(1, 3, 5, 1, ''),
(1, 3, 6, 1, ''),
(1, 3, 7, 1, ''),
(1, 3, 8, 1, ''),
(1, 3, 9, 1, ''),
(1, 3, 10, 1, ''),
(1, 3, 11, 1, ''),
(1, 3, 12, 1, ''),
(1, 3, 13, 1, ''),
(1, 3, 14, 1, ''),
(1, 4, 0, 1, ''),
(1, 4, 1, 1, ''),
(1, 4, 2, 1, ''),
(1, 4, 3, 1, ''),
(1, 4, 4, 1, ''),
(1, 4, 5, 1, ''),
(1, 4, 6, 1, ''),
(1, 4, 7, 1, ''),
(1, 4, 8, 1, ''),
(1, 4, 9, 1, ''),
(1, 4, 10, 1, ''),
(1, 4, 11, 1, ''),
(1, 4, 12, 1, ''),
(1, 4, 13, 1, ''),
(1, 4, 14, 1, ''),
(1, 5, 0, 1, ''),
(1, 5, 1, 1, ''),
(1, 5, 2, 1, ''),
(1, 5, 3, 1, ''),
(1, 5, 4, 1, ''),
(1, 5, 5, 1, ''),
(1, 5, 6, 1, ''),
(1, 5, 7, 1, ''),
(1, 5, 8, 1, ''),
(1, 5, 9, 1, ''),
(1, 5, 10, 1, ''),
(1, 5, 11, 1, ''),
(1, 5, 12, 1, ''),
(1, 5, 13, 1, ''),
(1, 5, 14, 1, ''),
(1, 6, 0, 1, ''),
(1, 6, 1, 1, ''),
(1, 6, 2, 1, ''),
(1, 6, 3, 1, ''),
(1, 6, 4, 1, ''),
(1, 6, 5, 1, ''),
(1, 6, 6, 1, ''),
(1, 6, 7, 1, ''),
(1, 6, 8, 1, ''),
(1, 6, 9, 1, ''),
(1, 6, 10, 1, ''),
(1, 6, 11, 1, ''),
(1, 6, 12, 1, ''),
(1, 6, 13, 1, ''),
(1, 6, 14, 1, ''),
(1, 7, 0, 1, ''),
(1, 7, 1, 1, ''),
(1, 7, 2, 1, ''),
(1, 7, 3, 1, ''),
(1, 7, 4, 1, ''),
(1, 7, 5, 1, ''),
(1, 7, 6, 1, ''),
(1, 7, 7, 1, ''),
(1, 7, 8, 1, ''),
(1, 7, 9, 1, ''),
(1, 7, 10, 1, ''),
(1, 7, 11, 1, ''),
(1, 7, 12, 1, ''),
(1, 7, 13, 1, ''),
(1, 7, 14, 1, ''),
(1, 8, 0, 1, ''),
(1, 8, 1, 1, ''),
(1, 8, 2, 1, ''),
(1, 8, 3, 1, ''),
(1, 8, 4, 1, ''),
(1, 8, 5, 1, ''),
(1, 8, 6, 1, ''),
(1, 8, 7, 1, ''),
(1, 8, 8, 1, ''),
(1, 8, 9, 1, ''),
(1, 8, 10, 1, ''),
(1, 8, 11, 1, ''),
(1, 8, 12, 1, ''),
(1, 8, 13, 1, ''),
(1, 8, 14, 1, ''),
(1, 9, 0, 1, ''),
(1, 9, 1, 1, ''),
(1, 9, 2, 1, ''),
(1, 9, 3, 1, ''),
(1, 9, 4, 1, ''),
(1, 9, 5, 1, ''),
(1, 9, 6, 1, ''),
(1, 9, 7, 1, ''),
(1, 9, 8, 1, ''),
(1, 9, 9, 1, ''),
(1, 9, 10, 1, ''),
(1, 9, 11, 1, ''),
(1, 9, 12, 1, ''),
(1, 9, 13, 1, ''),
(1, 9, 14, 1, ''),
(1, 10, 0, 1, ''),
(1, 10, 1, 1, ''),
(1, 10, 2, 1, ''),
(1, 10, 3, 1, ''),
(1, 10, 4, 1, ''),
(1, 10, 5, 1, ''),
(1, 10, 6, 1, ''),
(1, 10, 7, 1, ''),
(1, 10, 8, 1, ''),
(1, 10, 9, 1, ''),
(1, 10, 10, 1, ''),
(1, 10, 11, 1, ''),
(1, 10, 12, 1, ''),
(1, 10, 13, 1, ''),
(1, 10, 14, 1, ''),
(1, 11, 0, 1, ''),
(1, 11, 1, 1, ''),
(1, 11, 2, 1, ''),
(1, 11, 3, 1, ''),
(1, 11, 4, 1, ''),
(1, 11, 5, 1, ''),
(1, 11, 6, 1, ''),
(1, 11, 7, 1, ''),
(1, 11, 8, 1, ''),
(1, 11, 9, 1, ''),
(1, 11, 10, 1, ''),
(1, 11, 11, 1, ''),
(1, 11, 12, 1, ''),
(1, 11, 13, 1, ''),
(1, 11, 14, 1, '');

-- --------------------------------------------------------

--
-- Table structure for table `terem`
--

CREATE TABLE `terem` (
  `id` int(5) NOT NULL,
  `Nev` text NOT NULL,
  `Megjegyzes` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `terem`
--

INSERT INTO `terem` (`id`, `Nev`, `Megjegyzes`) VALUES
(1, 'Nagyterem', '');

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
  `refreshTokenExpiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vetites`
--

CREATE TABLE `vetites` (
  `id` int(5) NOT NULL,
  `Idopont` datetime NOT NULL,
  `Megjegyzes` longtext NOT NULL,
  `Filmid` int(11) NOT NULL,
  `Teremid` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vetitesszekek`
--

CREATE TABLE `vetitesszekek` (
  `Teremid` int(5) NOT NULL,
  `X` int(2) NOT NULL,
  `Y` int(2) NOT NULL,
  `Vetitesid` int(5) NOT NULL,
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
-- Dumping data for table `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20250319213034_OkThisIsFrTheLastOne', '8.0.2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `film`
--
ALTER TABLE `film`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`Teremid`,`X`,`Y`,`Vetitesid`,`FoglalasAdatokid`),
  ADD KEY `IX_FoglaltSzekek_FoglalasAdatokid` (`FoglalasAdatokid`);

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
  ADD UNIQUE KEY `UK_Users_Email` (`email`),
  ADD UNIQUE KEY `UK_Users_refreshToken` (`refreshToken`);

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
  ADD PRIMARY KEY (`Teremid`,`X`,`Y`,`Vetitesid`),
  ADD KEY `IX_VetitesSzekek_Vetitesid` (`Vetitesid`);

--
-- Indexes for table `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

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
-- AUTO_INCREMENT for table `terem`
--
ALTER TABLE `terem`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vetites`
--
ALTER TABLE `vetites`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `foglalasadatok`
--
ALTER TABLE `foglalasadatok`
  ADD CONSTRAINT `FK_FoglalasAdatok_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `foglaltszekek`
--
ALTER TABLE `foglaltszekek`
  ADD CONSTRAINT `FK_FoglaltSzekek_FoglalasAdatok_FoglalasAdatokid` FOREIGN KEY (`FoglalasAdatokid`) REFERENCES `foglalasadatok` (`id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `FK_VetitesSzekek_FoglaltSzekek_Teremid_X_Y_Vetitesid` FOREIGN KEY (`Teremid`,`X`,`Y`,`Vetitesid`) REFERENCES `foglaltszekek` (`Teremid`, `X`, `Y`, `Vetitesid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_VetitesSzekek_Szekek_Teremid_X_Y` FOREIGN KEY (`Teremid`,`X`,`Y`) REFERENCES `szekek` (`Teremid`, `X`, `Y`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_VetitesSzekek_Vetites_Vetitesid` FOREIGN KEY (`Vetitesid`) REFERENCES `vetites` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
