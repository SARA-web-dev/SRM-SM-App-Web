-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 30 juil. 2025 à 20:22
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_stages`
--

-- --------------------------------------------------------

--
-- Structure de la table `administrateur`
--

CREATE TABLE `administrateur` (
  `idAdmin` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `dateCreation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `administrateur`
--

INSERT INTO `administrateur` (`idAdmin`, `nom`, `email`, `motDePasse`, `dateCreation`) VALUES
(1, 'Admin SRM-SM', 'admin@srm-sm.ma', '$2b$10$pVA8yXixeObQcPG/6OKNg.b888wiV.VSjjKUiD2DWeXwMDpqGoyDa', '2025-07-07 11:47:00');

-- --------------------------------------------------------

--
-- Structure de la table `candidat`
--

CREATE TABLE `candidat` (
  `idCandidat` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `etablissement` varchar(100) NOT NULL,
  `domaine` varchar(100) NOT NULL,
  `niveau` varchar(50) NOT NULL,
  `dateInscription` timestamp NOT NULL DEFAULT current_timestamp(),
  `fichiersCV` varchar(255) DEFAULT NULL,
  `fichiersLettre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `candidat`
--

INSERT INTO `candidat` (`idCandidat`, `nom`, `prenom`, `email`, `motDePasse`, `telephone`, `adresse`, `etablissement`, `domaine`, `niveau`, `dateInscription`, `fichiersCV`, `fichiersLettre`) VALUES
(1, 'Dupont', 'Jean', 'jean.dupont@email.com', '$2b$10$rQJ5qVZvKxqzxvxvxvxvxOeKKF.Bb7l7l7l7l7l7l7l7l7l7l7l7l7', '0612345678', NULL, 'ENSA', 'Informatique', 'Bac+5', '2025-07-08 12:35:21', NULL, NULL),
(2, 'Martin', 'Marie', 'marie.martin@email.com', '$2b$10$rQJ5qVZvKxqzxvxvxvxvxOeKKF.Bb7l7l7l7l7l7l7l7l7l7l7l7l7', '0687654321', NULL, 'ENCG', 'Gestion', 'Bac+3', '2025-07-08 12:35:21', NULL, NULL),
(3, 'malak ', 'noha', 'malak@email.com', '$2b$10$hm9nxQ6CjY2Xk8IWDtYZ/.Mt5cBcPJ4xoKi52WdH.A5bETqz5A3Ve', '0684463472', 'Agadir', 'ENSA', 'Informatique', 'Bac+1', '2025-07-09 20:58:43', NULL, NULL),
(4, 'achraf', 'charaf', 'achraf@gmail.com', '$2b$10$2bd0JQMdLM27J2u0Hcngg.7wmWyuh5dXQSIMn05r7aK868ZVExTry', '6597597569', 'agadir', 'FST', 'Informatique', 'Bac+1', '2025-07-12 13:00:39', NULL, NULL),
(5, 'khadija', 'dija', 'khadija@gmail.com', '$2b$10$sXBOpkHoZtvhre3vQ49EH.uPG0jVfAjnPnHe1.qaKwIWvHtddANba', '069765784', 'Agadir', 'ENCG', 'Gestion', 'Bac+2', '2025-07-14 20:22:30', NULL, NULL),
(6, 'Ilham', 'Ham', 'ilham@gmail.com', '$2b$10$CMaJ2ViL2Yztv2usOF5zw.luCcukv1NinROt79TdxxvIEa68dSe4.', '06465375634', 'agadir', 'ENSAM', 'Génie Civil', 'Bac+3', '2025-07-15 19:00:19', NULL, NULL),
(7, 'fatima', 'fati', 'fati@gmail.com', '$2b$10$EO4gvPF1I4u/Q44t29KqzuzxrMBnsj67qshetMRjYDS3dOa820stC', '87697597656', 'agadir', 'ENSA', 'Génie Civil', 'Bac+4', '2025-07-20 01:01:31', NULL, NULL),
(8, 'omar ', 'amodi ', 'omar@gmail.com', '$2b$10$PX6Vxq9/Sw/2B1kE.sBBSuuhIvxlLXG/DBoy0D98tsgSUn85Jewce', '076856757', 'casa', 'INSEA', 'électricité et électromécanique', 'Bac+5', '2025-07-20 16:37:37', NULL, NULL),
(9, 'tasnim', 'tasnim', 'tasnim@gmail.com', '$2b$10$GB0b4EffX8AlhGwT4ONfIuLB3V2N4VLtGGx3U6oNhcJjSjTedcORy', '0876798597', 'agadir', 'ENSA', 'Informatique', 'Bac+2', '2025-07-21 11:10:58', NULL, NULL),
(10, 'hiba', 'hiba', 'hiba@gmail.com', '$2b$10$vnT/8MPrfHP.BqZ4IbvwVO6ou4EUuXpfjymFYx2MCuQxlwIMLFCYC', '98769569674', 'agadir', 'ENCG', 'Gestion', 'Bac+2', '2025-07-21 11:16:15', NULL, NULL),
(11, 'hajar', 'hajar', 'hajar@gmail.com', '$2b$10$ShbbWxY7DQb7Exjw15sNXenxoB9fnvYtuTTtANsiBK4/O3.ScFFGa', '098787695', 'agadir', 'EHTP', 'électricité et électromécanique', 'Bac+4', '2025-07-21 13:04:54', NULL, NULL),
(12, 'lina', 'lina', 'agadir@yopmail.com', '$2b$10$5YrDJThkNbUcVu0eMqvEaeITq4xusP6Z8bcjtFVi5Din0FBTI6ydW', '0636018999', 'agadir', 'ENSA', 'Informatique', 'Bac+3', '2025-07-25 10:03:57', NULL, NULL),
(13, 'maha', 'maha', 'maha@gmail.com', '$2b$10$0sgaTjjmo/mFMxMndsEs4u/Sl9NIp6IObxEuCElOMkOfik7AmfYy2', '0636018083', 'agadir', 'ENSEM', 'Génie Civil', 'Bac+1', '2025-07-26 22:06:08', NULL, NULL),
(14, 'hala', 'hala', 'hala@gmail.com', '$2b$10$WDQrQlmTagkwjshRPNKC9uGcstdKrj6OrPMkLl8epqG3HBB0lk/g6', '0676484684', 'agadir', 'ENSAM', 'Informatique', 'Bac+4', '2025-07-26 22:33:11', NULL, NULL),
(15, 'hanane', 'hana', 'hanane@gmail.com', '$2b$10$xv75ciaPRRYs1TpR48vW..CrK399NXMLH7bATLQd/ofda9bwRF7WS', '0678486548', 'agadir', 'INPT', 'Génie Civil', 'Bac+1', '2025-07-27 20:41:32', NULL, NULL),
(16, 'nasima', 'nasima', 'nasima@gmail.com', '$2b$10$v0rWRzl5uO6paPkJMINIqONNXCBzXsQECRqkLkARsE073kEMIGjQe', '0988774333', 'agadir', 'ENIM', 'Informatique', 'Bac+3', '2025-07-28 23:47:15', NULL, NULL),
(17, 'sanae', 'sana', 'sanae@gmail.com', '$2b$10$AdE/mrmbtNFPbRvQQitvkOefdfbj/l632d4pOEB4OEPhEcrJUK3t2', '0786877777', 'agadir', 'ENSA', 'informatique', 'Bac+5', '2025-07-29 11:40:19', NULL, NULL),
(18, 'karima', 'karima', 'karima@gmail.com', '$2b$10$XkoBmBTsiiqC8n7ggeKaKuAZRB1tmBSkM1wsbvokAQhknzJdp9va2', '086708798', 'agadir', 'ENSA', 'informatique', 'Bac+5', '2025-07-29 12:48:56', NULL, NULL),
(19, 'hanae', 'hanae', 'anae@gmail.com', '$2b$10$oISXwN4eyzf9tzZuzJbhN.yjT.wnFN0jWsECLgiZaT/GIPJy2TGVy', '064438633', 'agadir', 'ENCG', 'gestion', 'Bac+5', '2025-07-29 13:38:30', NULL, NULL),
(20, 'mahdi', 'mahdi', 'mahdi@gmail.com', '$2b$10$CRl4Oci3B8F7v0Pz7EiyR.FWKh5uIdKkojAjnmmgulfKhNF3En0mG', '0876975674', 'agadir', 'EHTP', 'logistique et transport', 'Bac+5', '2025-07-29 14:01:19', NULL, NULL),
(21, 'moaad', 'moaad', 'moaad@gmail.com', '$2b$10$mdTruf4F7UCxvyA7TihFceJiOc1a67w2880EYez7l0KGlPx9NF7q6', '087687576', 'agadir', 'ENSAM', 'électricité et électromécanique', 'Bac+5', '2025-07-29 14:07:12', NULL, NULL),
(22, 'noha', 'Noha', 'noha@gmail.com', '$2b$10$imR7q9R.Raod8/6akX7u2eGe9xD3zws/rEK2a53HzjcakxIxvBOge', '0897676597', 'agadir', 'ISCAE', 'ressources humaines', 'Bac+5', '2025-07-29 14:11:43', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `demandestage`
--

CREATE TABLE `demandestage` (
  `idDemande` int(11) NOT NULL,
  `dateDepot` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` enum('En attente','Accepté','Rejeté') DEFAULT 'En attente',
  `scoreML` decimal(3,2) DEFAULT NULL,
  `decisionRH` enum('En attente','Accepté','Rejeté') DEFAULT 'En attente',
  `motifRejet` text DEFAULT NULL,
  `fichiersCV` varchar(255) NOT NULL,
  `fichiersLettre` varchar(255) NOT NULL,
  `domaine` varchar(100) NOT NULL,
  `etablissement` varchar(100) NOT NULL,
  `niveau` varchar(50) NOT NULL,
  `experienceML` int(11) DEFAULT NULL,
  `competencesML` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `idCandidat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `demandestage`
--

INSERT INTO `demandestage` (`idDemande`, `dateDepot`, `statut`, `scoreML`, `decisionRH`, `motifRejet`, `fichiersCV`, `fichiersLettre`, `domaine`, `etablissement`, `niveau`, `experienceML`, `competencesML`, `description`, `idCandidat`) VALUES
(1, '2025-07-13 13:12:10', 'Accepté', 0.25, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1752412330654-523260931.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1752412330664-68387993.pdf', 'informatique', 'SRM-SM', 'Bac+1', 1, 'machine learning', 'bonjour', 4),
(2, '2025-07-14 20:24:00', 'Accepté', 0.15, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1752524640657-778301172.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1752524640667-431648069.pdf', 'gestion', 'SRM-SM', 'Bac+2', 1, '', 'coco', 5),
(3, '2025-07-15 19:01:03', 'Accepté', 0.17, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1752606063364-984289860.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1752606063368-397054356.pdf', 'génie civil', 'SRM-SM', 'Bac+3', 1, 'architecture,structure', 'hi', 6),
(4, '2025-06-15 19:19:12', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(5, '2025-06-20 19:19:12', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(6, '2025-06-30 19:19:12', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre3.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(7, '2025-07-05 19:19:12', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre4.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(8, '2025-06-15 19:20:59', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(9, '2025-06-20 19:20:59', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(10, '2025-06-25 19:20:59', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre3.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(11, '2025-06-15 19:21:57', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(12, '2025-06-20 19:21:57', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(13, '2025-06-30 19:21:57', 'Accepté', NULL, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre3.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(14, '2025-07-05 19:21:57', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre4.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(15, '2024-01-05 08:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(16, '2024-01-08 13:15:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(17, '2024-01-12 09:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan3.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(18, '2024-01-18 15:20:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan4.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 2),
(19, '2024-01-25 10:00:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan5.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan5.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 1),
(20, '2024-02-03 08:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(21, '2024-02-07 12:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(22, '2024-02-14 14:45:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev3.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(23, '2024-02-20 09:20:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev4.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 2),
(24, '2024-02-28 14:00:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev5.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev5.pdf', 'ressources humaines', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(25, '2024-03-02 08:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(26, '2024-03-08 12:30:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(27, '2024-03-15 16:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar3.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(28, '2024-03-22 09:50:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar4.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 1),
(29, '2024-03-29 13:25:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar5.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar5.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 2),
(30, '2024-04-05 10:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_avr1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_avr1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(31, '2024-04-10 13:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_avr2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_avr2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(32, '2024-04-18 10:20:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_avr3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_avr3.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(33, '2024-04-25 14:10:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_avr4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_avr4.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 2),
(34, '2024-05-03 08:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mai1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mai1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(35, '2024-05-12 12:40:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mai2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mai2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(36, '2024-05-20 15:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mai3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mai3.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 1),
(37, '2024-05-28 09:55:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mai4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mai4.pdf', 'ressources humaines', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(38, '2024-06-07 07:20:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_juin1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_juin1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(39, '2024-06-14 11:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_juin2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_juin2.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(40, '2024-06-21 14:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_juin3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_juin3.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 1),
(41, '2024-06-28 10:15:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_juin4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_juin4.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(42, '2024-07-05 13:20:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_juil1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_juil1.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(43, '2024-07-12 08:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_juil2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_juil2.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 2),
(44, '2024-07-19 15:10:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_juil3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_juil3.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(45, '2024-07-26 12:25:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_juil4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_juil4.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(46, '2024-08-08 09:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_aou1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_aou1.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 1),
(47, '2024-08-15 13:15:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_aou2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_aou2.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(48, '2024-08-22 10:50:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_aou3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_aou3.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 1),
(49, '2024-08-29 14:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_aou4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_aou4.pdf', 'ressources humaines', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(50, '2024-09-05 08:20:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_sep1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_sep1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(51, '2024-09-12 12:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_sep2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_sep2.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(52, '2024-09-19 15:10:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_sep3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_sep3.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 1),
(53, '2024-09-26 10:35:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_sep4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_sep4.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(54, '2024-10-03 13:50:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_oct1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_oct1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(55, '2024-10-10 09:25:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_oct2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_oct2.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 2),
(56, '2024-10-17 14:40:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_oct3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_oct3.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(57, '2024-10-24 11:15:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_oct4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_oct4.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(58, '2024-11-07 08:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_nov1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_nov1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(59, '2024-11-14 12:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_nov2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_nov2.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 2),
(60, '2024-11-21 15:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_nov3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_nov3.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(61, '2024-11-28 10:20:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_nov4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_nov4.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 2),
(62, '2024-12-05 09:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_dec1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_dec1.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(63, '2024-12-12 13:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_dec2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_dec2.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(64, '2024-12-19 14:15:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_dec3.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_dec3.pdf', 'ressources humaines', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(65, '2024-12-26 11:50:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_dec4.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_dec4.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 2),
(66, '2024-01-03 08:00:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_inf1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_inf1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(67, '2024-01-07 13:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_inf2.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_inf2.pdf', 'informatique', 'ENSA', 'Bac+4', NULL, NULL, NULL, 2),
(68, '2024-01-12 09:15:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_ges1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_ges1.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(69, '2024-01-18 15:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_elec1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_elec1.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(70, '2024-01-25 10:30:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_civil1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_civil1.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 1),
(71, '2024-01-28 14:20:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_log1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_log1.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 2),
(72, '2024-01-31 08:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_rh1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_rh1.pdf', 'ressources humaines', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(73, '2024-02-05 09:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev_inf1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev_inf1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(74, '2024-02-12 12:30:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev_ges1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev_ges1.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(75, '2024-02-18 14:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev_elec1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev_elec1.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(76, '2024-02-25 11:20:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev_civil1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev_civil1.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 2),
(77, '2024-02-28 14:50:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_fev_log1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_fev_log1.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 1),
(78, '2024-03-03 09:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar_inf1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar_inf1.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(79, '2024-03-10 14:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar_ges1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar_ges1.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(80, '2024-03-17 11:45:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar_elec1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar_elec1.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(81, '2024-03-24 16:20:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar_civil1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar_civil1.pdf', 'génie civil', 'ENIM', 'Bac+4', NULL, NULL, NULL, 2),
(82, '2024-03-31 10:05:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar_log1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar_log1.pdf', 'logistique et transport', 'ENCG', 'Bac+2', NULL, NULL, NULL, 1),
(83, '2024-03-15 13:25:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar_rh1.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar_rh1.pdf', 'ressources humaines', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(84, '2024-01-05 08:00:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(85, '2024-01-12 13:30:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(86, '2024-01-20 10:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jan_elec.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jan_elec.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(87, '2024-02-08 09:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_feb_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_feb_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(88, '2024-02-15 15:20:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_feb_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_feb_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(89, '2024-03-10 13:30:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(90, '2024-03-18 09:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_mar_elec.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_mar_elec.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(91, '2024-04-05 14:00:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_apr_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_apr_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(92, '2024-04-12 10:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_apr_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_apr_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(93, '2024-05-08 14:45:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_may_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_may_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(94, '2024-05-15 09:20:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_may_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_may_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(95, '2024-06-10 11:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jun_elec.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jun_elec.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(96, '2024-06-18 08:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jun_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jun_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(97, '2024-07-05 12:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jul_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jul_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(98, '2024-07-12 09:30:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_jul_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_jul_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(99, '2024-08-08 13:00:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_aug_elec.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_aug_elec.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(100, '2024-08-15 10:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_aug_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_aug_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(101, '2024-09-03 08:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_sep_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_sep_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(102, '2024-09-10 14:45:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_sep_elec.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_sep_elec.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 2),
(103, '2024-10-07 11:00:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_oct_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_oct_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 1),
(104, '2024-10-14 12:30:00', 'En attente', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_oct_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_oct_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 2),
(105, '2024-11-05 09:15:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_nov_elec.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_nov_elec.pdf', 'électricité et électromécanique', 'EST', 'Bac+3', NULL, NULL, NULL, 1),
(106, '2024-11-12 13:45:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_nov_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_nov_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(107, '2024-12-03 10:30:00', 'Accepté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_dec_inf.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_dec_inf.pdf', 'informatique', 'ENSA', 'Bac+5', NULL, NULL, NULL, 1),
(108, '2024-12-10 14:15:00', 'Rejeté', NULL, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/cv_dec_ges.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\/lettre_dec_ges.pdf', 'gestion', 'ENCG', 'Bac+3', NULL, NULL, NULL, 2),
(109, '2025-07-20 01:02:44', 'Accepté', 0.17, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1752973364710-266639087.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1752973364722-83635958.pdf', 'génie civil', 'SRM-SM', 'Bac+4', 1, 'structure,architecture', 'hi', 7),
(110, '2025-07-20 16:38:48', 'En attente', 0.15, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753029528706-806538796.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753029528720-767285765.pdf', 'Electricite et Electromecanique', 'SRM-SM', 'Bac+5', 1, '', NULL, 8),
(111, '2025-07-21 11:13:09', 'Accepté', 0.25, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753096389419-486674126.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753096389427-152157738.pdf', 'informatique', 'SRM-SM', 'Bac+3', 1, 'machine learning', NULL, 9),
(112, '2025-07-21 11:17:14', 'Accepté', 0.15, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753096634494-394352465.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753096634498-504273863.pdf', 'gestion', 'SRM-SM', 'Bac+2', 1, '', NULL, 10),
(113, '2025-07-21 13:06:23', 'En attente', 0.15, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753103183151-31018482.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753103183157-297300314.pdf', 'Electricite et Electromecanique', 'SRM-SM', 'Bac+4', 1, '', NULL, 11),
(114, '2025-07-21 13:16:14', 'Rejeté', 0.15, 'Rejeté', 'mois d\'expérience', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753103774857-645173661.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753103774872-323229281.pdf', 'Electricite et Electromecanique', 'SRM-SM', 'Bac+2', 1, '', NULL, 11),
(115, '2025-07-25 10:06:03', 'En attente', 0.20, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753750338634-769385460.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753750338637-263417051.pdf', 'informatique', 'SRM-SM', 'Bac+3', 0, '', NULL, 12),
(116, '2025-07-26 22:43:29', 'Accepté', 0.25, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753569809080-386566011.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753569809092-474981517.pdf', 'informatique', 'Autres', 'Bac+3', 1, 'machine learning', NULL, 14),
(117, '2025-07-27 20:42:30', 'En attente', 0.20, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753648950773-458132387.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753648950786-532141310.pdf', 'génie civil', 'SRM-SM', 'Bac+1', 0, '', NULL, 15),
(118, '2025-07-28 23:48:19', 'En attente', 0.20, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753747783640-699473943.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753746499916-97487706.pdf', 'informatique', 'SRM-SM', 'Bac+3', 0, '', NULL, 16),
(119, '2025-07-29 00:12:33', 'En attente', 0.20, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753748584326-11600486.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753747953532-337650207.pdf', 'informatique', 'SRM-SM', 'Bac+3', 0, '', NULL, 16),
(120, '2025-07-29 00:24:11', 'En attente', 0.20, 'En attente', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753748651681-391119583.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753748651682-588078611.pdf', 'informatique', 'SRM-SM', 'Bac+3', 0, '', NULL, 16),
(121, '2025-07-29 00:27:33', 'Accepté', 0.47, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753796797163-82060413.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753748853248-526211917.pdf', 'informatique', 'SRM-SM', 'Bac+3', 0, 'postman,redis,node,jenkins,typescript,linux,microservices,devops,github actions,javascript', NULL, 16),
(122, '2025-07-29 00:29:10', 'Accepté', 0.81, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753797888410-227372951.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753795972900-226735708.pdf', 'génie civil', 'SRM-SM', 'Bac+3', 5, 'robot structural,topographie,b�ton,autocad,g�nie civil,planning,revit,b�ton arm�', NULL, 15),
(123, '2025-07-29 00:31:39', 'Rejeté', 0.20, 'Rejeté', 'mois ', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753749099027-900056666.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753749099043-248910414.pdf', 'informatique', 'SRM-SM', 'Bac+3', 0, '', NULL, 7),
(124, '2025-07-29 11:40:48', 'Accepté', 0.47, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753796150417-137149992.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753789248293-339724253.pdf', 'informatique', 'SRM-SM', 'Bac+5', 0, 'sql,vpn,ansible,jenkins,postgresql,bgp,powershell,python,lambda,wireshark', NULL, 17),
(125, '2025-07-29 12:49:42', 'En attente', 0.20, 'En attente', NULL, '1753794012764-418392173.pdf', '1753793932142-943616728.pdf', 'informatique', 'SRM-SM', 'Bac+5', 0, '', NULL, 18),
(126, '2025-07-29 13:12:47', 'Accepté', 0.72, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753797443621-197241572.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753794767399-18952985.pdf', 'informatique', 'SRM-SM', 'Bac+5', 9, 'node,terraform,bash,grafana,gcp,nlp,microservices,linux,tensorflow,python', NULL, 18),
(127, '2025-07-29 13:39:13', 'Accepté', 0.73, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753797311926-110820373.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753796353664-627086113.pdf', 'gestion', 'SRM-SM', 'Bac+5', 5, 'sem,excel,budget,tva,seo,fiscalit�,marketing,strat�gie,commerce international', NULL, 19),
(128, '2025-07-29 14:02:07', 'Accepté', 0.90, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753797727033-303180979.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753797727034-980225863.pdf', 'logistique et transport', 'SRM-SM', 'Bac+5', 5, 'transport,logistique,transport maritime,douane,supply chain,incoterms,pr�paration commandes,optimisation,stock,wms', NULL, 20),
(129, '2025-07-29 14:07:59', 'Accepté', 0.72, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753798079664-225589868.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753798079665-463919456.pdf', 'électricité et électromécanique', 'SRM-SM', 'Bac+5', 6, 'plc,�lectrotechnique,automatisme,scada', NULL, 21),
(130, '2025-07-29 14:14:00', 'Accepté', 0.75, 'Accepté', NULL, 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753798440377-166460530.pdf', 'C:\\Users\\Sara\\Desktop\\SRM-SM_Stage_App\\backend\\uploads\\1753798440377-679955599.pdf', 'ressources humaines', 'SRM-SM', 'Bac+5', 6, 'bilan comp�tences,formation,gpec,recrutement', NULL, 22);

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `idMessage` int(11) NOT NULL,
  `idDemande` int(11) NOT NULL,
  `idExpediteur` int(11) NOT NULL,
  `roleExpediteur` enum('candidat','admin') NOT NULL,
  `message` text NOT NULL,
  `dateEnvoi` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`idMessage`, `idDemande`, `idExpediteur`, `roleExpediteur`, `message`, `dateEnvoi`) VALUES
(1, 114, 1, 'admin', 'bonjour , tu as accepté hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', '2025-07-22 22:07:59'),
(2, 114, 1, 'admin', 'bonjour hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', '2025-07-22 22:14:12'),
(3, 114, 1, 'admin', 'bonjour', '2025-07-23 11:43:30'),
(4, 114, 11, 'candidat', 'bonjour', '2025-07-23 11:45:09'),
(5, 114, 1, 'admin', 'hhh', '2025-07-23 12:34:54'),
(7, 114, 1, 'admin', 'hbhv', '2025-07-23 13:41:18'),
(8, 114, 1, 'admin', 'jhkjh', '2025-07-23 13:42:21'),
(9, 114, 11, 'candidat', 'hbkjh', '2025-07-23 13:42:45'),
(10, 6, 1, 'admin', 'Bonjour candidat 114', '2025-07-23 13:48:13'),
(11, 114, 11, 'candidat', 'bonjour', '2025-07-23 14:05:27'),
(12, 114, 1, 'admin', 'bonjour', '2025-07-23 14:06:03'),
(13, 109, 1, 'admin', 'bbbb', '2025-07-23 16:03:13'),
(14, 114, 11, 'candidat', 'bbbbb', '2025-07-23 16:03:56'),
(15, 112, 1, 'admin', 'hi', '2025-07-23 16:15:12'),
(16, 114, 1, 'admin', 'nnn', '2025-07-23 23:58:17'),
(17, 114, 11, 'candidat', ',,,,,', '2025-07-23 23:59:05'),
(18, 114, 11, 'candidat', 'nnnn', '2025-07-23 23:59:30'),
(19, 113, 11, 'candidat', 'jjjj', '2025-07-23 23:59:37'),
(20, 112, 1, 'admin', 'jjj', '2025-07-24 00:00:18'),
(21, 112, 10, 'candidat', 'jjjjj', '2025-07-24 00:01:11'),
(22, 111, 1, 'admin', 'jnjnjkb', '2025-07-24 00:05:41'),
(23, 111, 9, 'candidat', 'nnnnnkjn', '2025-07-24 00:06:28'),
(24, 111, 9, 'candidat', 'bn hj', '2025-07-24 00:07:17'),
(25, 114, 1, 'admin', 'gggggggggg', '2025-07-24 01:21:31'),
(26, 110, 1, 'admin', 'coco', '2025-07-24 01:41:50'),
(27, 110, 8, 'candidat', 'cv', '2025-07-24 01:42:51'),
(28, 114, 1, 'admin', 'hhh', '2025-07-24 01:54:21'),
(29, 3, 6, 'candidat', 'bonjour', '2025-07-24 02:03:59'),
(30, 3, 6, 'candidat', 'bonjour', '2025-07-24 02:04:17'),
(31, 3, 1, 'admin', 'bonjour', '2025-07-24 02:06:16'),
(32, 3, 6, 'candidat', 'Mr', '2025-07-24 02:07:23'),
(33, 114, 1, 'admin', 'hhh', '2025-07-24 20:50:54'),
(34, 113, 1, 'admin', 'jjj', '2025-07-24 20:51:01'),
(35, 112, 1, 'admin', 'njjj', '2025-07-24 20:51:14'),
(36, 112, 10, 'candidat', 'jjj', '2025-07-24 20:51:55'),
(37, 112, 10, 'candidat', 'jnn', '2025-07-24 20:53:06'),
(38, 113, 1, 'admin', 'hhhhihu', '2025-07-25 10:57:19'),
(39, 114, 1, 'admin', 'cc', '2025-07-25 10:58:04'),
(40, 115, 1, 'admin', 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', '2025-07-26 14:23:22'),
(41, 1, 4, 'candidat', 'hi', '2025-07-26 14:25:36'),
(42, 114, 1, 'admin', 'hi', '2025-07-26 17:16:19'),
(43, 115, 1, 'admin', 'bonjour', '2025-07-26 17:22:05'),
(44, 115, 1, 'admin', 'BONJOUR', '2025-07-26 17:23:10'),
(45, 113, 1, 'admin', 'hhhh', '2025-07-26 18:08:49'),
(46, 115, 12, 'candidat', 'bonjour', '2025-07-26 18:11:06'),
(47, 116, 1, 'admin', 'bonjour', '2025-07-26 23:44:33'),
(48, 116, 14, 'candidat', 'bonjour', '2025-07-26 23:45:36'),
(49, 130, 1, 'admin', 'bonjour', '2025-07-29 15:16:09'),
(50, 130, 22, 'candidat', 'bonjour', '2025-07-29 15:16:52');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `administrateur`
--
ALTER TABLE `administrateur`
  ADD PRIMARY KEY (`idAdmin`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `candidat`
--
ALTER TABLE `candidat`
  ADD PRIMARY KEY (`idCandidat`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_candidat_email` (`email`);

--
-- Index pour la table `demandestage`
--
ALTER TABLE `demandestage`
  ADD PRIMARY KEY (`idDemande`),
  ADD KEY `idx_demande_candidat` (`idCandidat`),
  ADD KEY `idx_demande_statut` (`statut`),
  ADD KEY `idx_demande_date` (`dateDepot`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`idMessage`),
  ADD KEY `idDemande` (`idDemande`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `administrateur`
--
ALTER TABLE `administrateur`
  MODIFY `idAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `candidat`
--
ALTER TABLE `candidat`
  MODIFY `idCandidat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `demandestage`
--
ALTER TABLE `demandestage`
  MODIFY `idDemande` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `idMessage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `demandestage`
--
ALTER TABLE `demandestage`
  ADD CONSTRAINT `demandestage_ibfk_1` FOREIGN KEY (`idCandidat`) REFERENCES `candidat` (`idCandidat`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`idDemande`) REFERENCES `demandestage` (`idDemande`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
