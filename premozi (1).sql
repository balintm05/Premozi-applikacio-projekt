-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2025 at 11:16 AM
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
-- Table structure for table `rendeles`
--

CREATE TABLE `rendeles` (
  `id` int(11) NOT NULL,
  `Hely` text NOT NULL,
  `Statusz` int(1) NOT NULL,
  `Megjegyzes` longtext NOT NULL,
  `userID` int(11) NOT NULL,
  `Vetitesid` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `terem`
--

CREATE TABLE `terem` (
  `id` int(5) NOT NULL,
  `Ferohely` int(3) NOT NULL,
  `Tipus` text NOT NULL,
  `Sorok` int(3) NOT NULL,
  `Allapot` longtext NOT NULL,
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
(1, 'premoziadmin@gmail.com', 'AQAAAAIAAYagAAAAEP/W3zXYyYQIGoN08LDeHVF2Ip/gdIw9avLzLMnDXBFglMjfKY5HARXvQH572yq6LA==', '2025-03-12 08:50:47', 1, 'Admin', '', 'F2FE1C14CEFBEE164F099DACAC80A17DE7A5CE6D782F75F18D2843CAECC5218D', '2025-03-21 08:59:46'),
(2, 'admin123@gmail.com', 'AQAAAAIAAYagAAAAEN3S5HDHeWWrwU3du/cQHFjRfxu4EKAyHNqhUl6QpBApr0mV3MVVVXvATk7RXeyvig==', '2025-03-18 10:01:35', 1, 'Admin', '', '4659E64380709B68E2E2D3CD59F0216CD762CE1EE77E50CCD180FEE705111C8E', '2025-03-25 10:02:26');

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
('20250311085103_103pcbalintinit', '8.0.2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `film`
--
ALTER TABLE `film`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rendeles`
--
ALTER TABLE `rendeles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IX_Rendeles_userID` (`userID`),
  ADD KEY `IX_Rendeles_Vetitesid` (`Vetitesid`);

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
  ADD UNIQUE KEY `UK_Users_email` (`email`);

--
-- Indexes for table `vetites`
--
ALTER TABLE `vetites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IX_Vetites_Filmid` (`Filmid`),
  ADD KEY `IX_Vetites_Teremid` (`Teremid`);

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
-- AUTO_INCREMENT for table `rendeles`
--
ALTER TABLE `rendeles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `terem`
--
ALTER TABLE `terem`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vetites`
--
ALTER TABLE `vetites`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rendeles`
--
ALTER TABLE `rendeles`
  ADD CONSTRAINT `FK_Rendeles_Users_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Rendeles_Vetites_Vetitesid` FOREIGN KEY (`Vetitesid`) REFERENCES `vetites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vetites`
--
ALTER TABLE `vetites`
  ADD CONSTRAINT `FK_Vetites_Film_Filmid` FOREIGN KEY (`Filmid`) REFERENCES `film` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Vetites_Terem_Teremid` FOREIGN KEY (`Teremid`) REFERENCES `terem` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
