-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2025 at 01:09 PM
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
  `AlapAr` int(11) NOT NULL,
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
  `FoglalasAdatokid` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `Vetitesid` int(11) NOT NULL,
  `Teremid` int(11) NOT NULL
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
  `refreshTokenExpiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `email`, `passwordHash`, `creationDate`, `accountStatus`, `role`, `Megjegyzes`, `refreshToken`, `refreshTokenExpiry`) VALUES
(1, 'admin123@gmail.com', 'AQAAAAIAAYagAAAAEOogko3lIO7F90ehoeuOFAeqxzCdWzRCm6tyTdvaipgrxuk26vdOX4d0DkX0SqNQ7A==', '2025-03-20 10:50:44', 1, 'Admin', '', '2EEA10522EB2D1723F49E9A414A182F06382AD9ABC8E034A1203AF9724CBBD76', '2025-03-27 10:51:11');

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
  `Teremid` int(11) NOT NULL,
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
('20250320083533_bruh', '8.0.2');

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
  ADD PRIMARY KEY (`FoglalasAdatokid`,`Vetitesid`,`Teremid`,`X`,`Y`),
  ADD KEY `IX_FoglaltSzekek_Vetitesid_Teremid_X_Y` (`Vetitesid`,`Teremid`,`X`,`Y`);

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
  ADD PRIMARY KEY (`Vetitesid`,`Teremid`,`X`,`Y`),
  ADD KEY `IX_VetitesSzekek_Teremid_X_Y` (`Teremid`,`X`,`Y`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vetites`
--
ALTER TABLE `vetites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `FK_FoglaltSzekek_FoglalasAdatok_FoglalasAdatokid` FOREIGN KEY (`FoglalasAdatokid`) REFERENCES `foglalasadatok` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_FoglaltSzekek_VetitesSzekek_Vetitesid_Teremid_X_Y` FOREIGN KEY (`Vetitesid`,`Teremid`,`X`,`Y`) REFERENCES `vetitesszekek` (`Vetitesid`, `Teremid`, `X`, `Y`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `FK_VetitesSzekek_Szekek_Teremid_X_Y` FOREIGN KEY (`Teremid`,`X`,`Y`) REFERENCES `szekek` (`Teremid`, `X`, `Y`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_VetitesSzekek_Vetites_Vetitesid` FOREIGN KEY (`Vetitesid`) REFERENCES `vetites` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
