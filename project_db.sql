-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Dec 11, 2025 at 03:58 AM
-- Server version: 9.5.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_id` int NOT NULL,
  `user_id` int NOT NULL,
  `adm_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `adm_lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_id`, `user_id`, `adm_name`, `adm_lastname`, `created_at`, `updated_at`) VALUES
(1, 1, 'adminName', 'adminLastname', '0000-00-00 00:00:00', '2025-12-11 03:58:21');

-- --------------------------------------------------------

--
-- Table structure for table `admin_message`
--

CREATE TABLE `admin_message` (
  `adm_mes_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `mes_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mes_desp` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mes_status` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_message`
--

INSERT INTO `admin_message` (`adm_mes_id`, `admin_id`, `student_id`, `mes_title`, `mes_desp`, `mes_status`, `created_at`) VALUES
(1, 1, 680741145, 'ข้อความจาก LINE นักศึกษา', 'ชื่อนักศึกษา: กิติยาวี ส่องแสง\nรหัสนักศึกษา: 680741145\nชื่อ LINE: prae\nข้อความที่ส่งมา: ติดต่อเจ้าหน้าที่', 'N', '2025-11-30 17:09:04'),
(2, 1, 680741145, 'ข้อความจาก LINE นักศึกษา', 'ชื่อนักศึกษา: กิติยาวี ส่องแสง\nรหัสนักศึกษา: 680741145\nชื่อ LINE: prae\nข้อความที่ส่งมา: ติดต่อเจ้าหน้าที่', 'N', '2025-11-30 18:10:06'),
(3, 1, 680741145, 'ข้อความจาก LINE นักศึกษา', 'ชื่อนักศึกษา: กิติยาวี ส่องแสง\nรหัสนักศึกษา: 680741145\nชื่อ LINE: prae\nข้อความที่ส่งมา: ติดต่อเจ้าหน้าที่', 'N', '2025-11-30 18:18:36'),
(4, 1, 680741145, 'ข้อความจาก LINE นักศึกษา', 'ชื่อนักศึกษา: กิติยาวี ส่องแสง\nรหัสนักศึกษา: 680741145\nชื่อ LINE: prae\nข้อความที่ส่งมา: ติดต่อเจ้าหน้าที่', 'N', '2025-11-30 19:13:24'),
(5, 1, 680741145, 'ข้อความจาก LINE นักศึกษา', 'ชื่อนักศึกษา: กิติยาวี ส่องแสง\nรหัสนักศึกษา: 680741145\nชื่อ LINE: prae\nข้อความที่ส่งมา: ติดต่อเจ้าหน้าที่', 'N', '2025-12-01 09:25:36');

-- --------------------------------------------------------

--
-- Table structure for table `admin_notification`
--

CREATE TABLE `admin_notification` (
  `adm_noti_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `scholarship_id` int DEFAULT NULL,
  `noti_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_notification`
--

INSERT INTO `admin_notification` (`adm_noti_id`, `admin_id`, `student_id`, `scholarship_id`, `noti_type`, `is_read`, `created_at`) VALUES
(1, 1, 680741145, NULL, 'line_contact', 0, '2025-11-30 18:10:06'),
(2, 1, 680741145, NULL, 'line_contact', 1, '2025-11-30 18:18:36'),
(3, 1, 680741145, NULL, 'line_contact', 0, '2025-11-30 19:13:24'),
(4, 1, 680741145, 12, 'student_request_info', 0, '2025-11-30 20:06:15'),
(5, 1, 680741145, NULL, 'line_contact', 0, '2025-12-01 09:25:36'),
(6, 1, 680741145, 8, 'student_request_info', 0, '2025-12-01 20:40:13'),
(7, 1, 680741145, 12, 'student_request_info', 0, '2025-12-03 02:59:35'),
(8, 1, 680741145, 12, 'student_request_info', 1, '2025-12-03 13:22:54'),
(9, 1, 680741145, 12, 'student_request_info', 0, '2025-12-04 07:14:06'),
(10, 1, 680741145, 12, 'student_request_info', 0, '2025-12-11 00:02:22'),
(11, 1, 680741145, 13, 'student_request_info', 0, '2025-12-11 00:02:36');

-- --------------------------------------------------------

--
-- Table structure for table `bookmark`
--

CREATE TABLE `bookmark` (
  `bookmark_id` int NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `scho_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookmark`
--

INSERT INTO `bookmark` (`bookmark_id`, `student_id`, `scho_id`, `is_active`, `created_at`, `updated_at`) VALUES
(66, 680741145, 9, 1, '2025-11-26 04:24:16', '2025-11-26 04:24:16'),
(68, 680741145, 8, 1, '2025-12-02 13:11:42', '2025-12-02 13:11:42'),
(69, 680741145, 12, 1, '2025-12-02 13:11:45', '2025-12-02 13:11:45'),
(70, 6508907717, 8, 1, '2025-12-02 13:13:40', '2025-12-02 13:13:40'),
(71, 6508907717, 12, 1, '2025-12-02 13:13:42', '2025-12-02 13:13:42');

-- --------------------------------------------------------

--
-- Table structure for table `enroll`
--

CREATE TABLE `enroll` (
  `enroll_id` int NOT NULL,
  `std_id` bigint UNSIGNED NOT NULL,
  `scho_id` int NOT NULL,
  `qua_id` int NOT NULL,
  `enroll_status` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางเริ่มรับสมัครทุน';

--
-- Dumping data for table `enroll`
--

INSERT INTO `enroll` (`enroll_id`, `std_id`, `scho_id`, `qua_id`, `enroll_status`, `created_at`, `updated_at`) VALUES
(6, 680741145, 8, 5, 1, '2025-11-14 18:51:05', '2025-12-03 05:06:07'),
(7, 680741145, 9, 6, 0, '2025-11-21 09:26:47', '2025-12-11 03:14:38'),
(13, 6508907717, 11, 8, 1, '2025-12-04 04:12:23', '2025-12-04 04:12:23'),
(14, 6508907717, 10, 7, 1, '2025-12-04 04:13:39', '2025-12-04 04:13:39'),
(15, 6708741454, 20, 5, 1, '2025-12-04 06:27:51', '2025-12-04 06:27:51');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `news_id` int NOT NULL,
  `news_title` varchar(255) DEFAULT NULL,
  `news_content` text NOT NULL,
  `news_file` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `news_title`, `news_content`, `news_file`, `created_at`, `updated_at`, `is_active`) VALUES
(16, 'test ', 'ประกาศ', NULL, '2025-11-05 06:27:48', '2025-11-28 08:21:57', 0),
(17, 'test 2', 'สวัสดี', NULL, '2025-11-05 06:30:01', '2025-11-28 08:21:57', 0),
(19, 'ประกาศรับสมัครนักศึกษาผู้ขาดแคลนทุนทรัพย์ ประจำปีการศึกษา 2568', 'รายละเอียดข้างล่าง', '1764645578051-announcementNameOfRecipients-2566.pdf', '2025-11-28 08:21:55', '2025-12-11 02:44:48', 0),
(20, 'ประกาศ นักศึกษาใหม่โปรดเพิ่มเพื่อน LineOA  เพื่อรับข้อมูลรายละเอียดทุนการศึกษา', 'test', NULL, '2025-11-29 14:16:00', '2025-12-04 07:07:23', 0),
(24, 'ประกาศรายชื่อผู้สมควรได้รับทุนมูลนิธิอิออนประเทศไทย ประจำปีการศึกษา 2568', '', NULL, '2025-12-11 02:42:27', '2025-12-11 02:45:52', 1);

-- --------------------------------------------------------

--
-- Table structure for table `qualification`
--

CREATE TABLE `qualification` (
  `qua_id` int NOT NULL,
  `std_year` int NOT NULL,
  `std_gpa` decimal(3,2) UNSIGNED NOT NULL,
  `std_income` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `qualification`
--

INSERT INTO `qualification` (`qua_id`, `std_year`, `std_gpa`, `std_income`) VALUES
(5, 1, 3.00, 120000),
(6, 1, 3.00, 0),
(7, 1, 3.00, 120000),
(8, 2, 3.60, 0),
(9, 0, 0.00, 0),
(12, 1, 3.00, 100000),
(13, 1, 3.00, 150000),
(14, -1, 0.00, 200000),
(15, 1, 0.00, 0),
(16, 1, 0.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `scholarship_info`
--

CREATE TABLE `scholarship_info` (
  `scholarship_id` int NOT NULL,
  `scho_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `scho_year` int NOT NULL,
  `qualification` int NOT NULL,
  `scho_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ทุนเหมาจ่ายหรือทุนระยะยาว',
  `scho_source` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ทุนภายในหรือทุนภายนอก',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `scho_desp` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `scho_file` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'file_path',
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarship_info`
--

INSERT INTO `scholarship_info` (`scholarship_id`, `scho_name`, `scho_year`, `qualification`, `scho_type`, `scho_source`, `start_date`, `end_date`, `scho_desp`, `image_file`, `scho_file`, `is_active`, `created_at`, `updated_at`) VALUES
(8, 'ทุนสำหรับนักเรียนขาดแคลนทรัพย์', 2568, 5, 'ทุนระยะยาว', 'ทุนภายใน', '2025-09-16', '2025-09-29', 'test ', '1763109390034-CSTU.png', '1764646380959-scholarshipOfSeacon-2025.pdf', 1, '2025-11-12 08:46:07', '2025-12-03 09:37:03'),
(9, 'ทุนโครงการคาเอเดะ', 2568, 6, 'ทุนเหมาจ่าย', 'ทุนภายนอก', '2025-10-14', '2025-10-23', 'มีจิตอาสา', NULL, NULL, 1, '2025-11-12 10:23:00', '2025-12-03 09:36:43'),
(10, 'ทุนมูลนิธิอิออนประเทศไทย', 2571, 7, 'ทุนระยะยาว', 'ทุนภายนอก', '2025-06-17', '2025-07-23', 'นักศึกษาปีที่ 1 ให้เกรดเฉลี่ยของมัธยมปลายแทน', NULL, '1764754727012-iOnThaiScholarship-2567.pdf', 1, '2025-11-28 07:45:56', '2025-12-04 06:24:29'),
(11, 'รับสมัครทุน บริษัท ซีคอน จำกัด ', 2570, 8, 'ทุนระยะยาว', 'ทุนภายนอก', '2025-02-12', '2025-03-13', '-ไม่เป็นนักศึกษาที่ได้รับทุนการศึกษาอื่นใด หรือกำลังอยู่ระหว่างรอรับทุน\r\n-เป็นนักศึกษาที่มีจิตอาสา มีคุณธรรม แต่ขาดแคลนทุนทรัพย์ในการศึกษา มีความประพฤติเรียบร้อย และไม่เคย\r\nถูกลงโทษทางวินัยเป็นนักศึกษาที่มีจิตอาสา มีคุณธรรม แต่ขาดแคลนทุนทรัพย์ในการศึกษา ม', NULL, '1764292185687-scholarshipOfSeacon-2025.pdf', 1, '2025-11-28 08:09:45', '2025-12-04 06:24:07'),
(12, 'สมัครขอรับทุนภัยพิบัติ ปีการศึกษา 2568', 2568, 9, 'ทุนเหมาจ่าย', 'ทุนภายใน', '2025-01-01', '2025-12-31', '1. เป็นนักศึกษา มธ. ระดับปริญญาตรี\r\n2. นักศึกษา/ผู้ปกครองมีภูมิลำเนาในพื้นที่ประสบภัยพิบัติ\r\n3. มีความประพฤติดี\r\n4. ได้รับการรับรองจากหน่วยงานราชการ ว่าพื้นที่ที่อยู่อาศัยดังกล่าวอยู่ในเขตภัยพิบัติ', NULL, '1764292471311-20250218 à¹à¸à¸à¸à¸­à¸£à¹à¸¡à¸à¸­à¸à¸¸à¸à¸ à¸±à¸¢à¸à¸´à¸à¸±à¸à¸´.pdf', 1, '2025-11-28 08:14:31', '2025-12-03 10:01:07'),
(20, 'ทุนทดสอบปี 2569', 2569, 5, 'ทุนเหมาจ่าย', 'ทุนภายนอก', NULL, NULL, 'mock test', NULL, NULL, 0, '2025-12-03 21:04:54', '2025-12-11 03:06:31');

-- --------------------------------------------------------

--
-- Table structure for table `std_notification`
--

CREATE TABLE `std_notification` (
  `std_noti_id` int NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `std_noti_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `scholarship_id` int DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `std_notification`
--

INSERT INTO `std_notification` (`std_noti_id`, `student_id`, `std_noti_type`, `scholarship_id`, `is_read`, `created_at`) VALUES
(1, 680741145, 'new_news', NULL, 1, '2025-11-29 14:16:00'),
(2, 680741145, 'line_sent_detail', 12, 0, '2025-11-30 15:24:04'),
(3, 680741145, 'line_sent_detail', 12, 1, '2025-11-30 15:24:13'),
(4, 680741145, 'line_sent_detail', 12, 0, '2025-11-30 17:02:38'),
(5, 680741145, 'line_sent_detail', 12, 0, '2025-11-30 17:08:43'),
(6, 680741145, 'line_sent_detail', 12, 0, '2025-11-30 20:06:15'),
(7, 680741145, 'line_sent_detail', 8, 0, '2025-12-01 20:40:13'),
(8, 680741145, 'SCHO_NEW', NULL, 0, '2025-12-01 22:42:34'),
(9, 680741145, 'line_sent_detail', 12, 0, '2025-12-03 02:59:35'),
(10, 680741145, 'new_news', NULL, 0, '2025-12-03 04:56:32'),
(11, 6508907717, 'new_news', NULL, 0, '2025-12-03 04:56:32'),
(12, 6309650916, 'new_news', NULL, 0, '2025-12-03 04:56:32'),
(13, 6708741454, 'new_news', NULL, 0, '2025-12-03 04:56:32'),
(17, 680741145, 'SCHO_NEW', NULL, 0, '2025-12-03 05:03:32'),
(18, 6508907717, 'SCHO_NEW', NULL, 0, '2025-12-03 05:03:32'),
(19, 6309650916, 'SCHO_NEW', NULL, 0, '2025-12-03 05:03:32'),
(20, 6708741454, 'SCHO_NEW', NULL, 0, '2025-12-03 05:03:32'),
(21, 680741145, 'SCHO_NEW', NULL, 0, '2025-12-03 10:20:10'),
(22, 6508907717, 'SCHO_NEW', NULL, 0, '2025-12-03 10:20:10'),
(23, 6309650916, 'SCHO_NEW', NULL, 0, '2025-12-03 10:20:10'),
(24, 6708741454, 'SCHO_NEW', NULL, 0, '2025-12-03 10:20:10'),
(25, 680741145, 'line_sent_detail', 12, 0, '2025-12-03 13:22:54'),
(26, 680741145, 'new_news', NULL, 0, '2025-12-03 16:04:22'),
(27, 6508907717, 'new_news', NULL, 0, '2025-12-03 16:04:22'),
(28, 6309650916, 'new_news', NULL, 0, '2025-12-03 16:04:22'),
(29, 6708741454, 'new_news', NULL, 0, '2025-12-03 16:04:22'),
(33, 680741145, 'SCHO_NEW', NULL, 0, '2025-12-03 16:06:14'),
(34, 6508907717, 'SCHO_NEW', NULL, 0, '2025-12-03 16:06:14'),
(35, 6309650916, 'SCHO_NEW', NULL, 0, '2025-12-03 16:06:14'),
(36, 6708741454, 'SCHO_NEW', NULL, 0, '2025-12-03 16:06:14'),
(37, 680741145, 'new_news', NULL, 0, '2025-12-04 07:05:10'),
(38, 6508907717, 'new_news', NULL, 0, '2025-12-04 07:05:10'),
(39, 6309650916, 'new_news', NULL, 0, '2025-12-04 07:05:10'),
(40, 6708741454, 'new_news', NULL, 0, '2025-12-04 07:05:10'),
(44, 680741145, 'SCHO_NEW', NULL, 0, '2025-12-04 07:10:37'),
(45, 6508907717, 'SCHO_NEW', NULL, 0, '2025-12-04 07:10:37'),
(46, 6309650916, 'SCHO_NEW', NULL, 0, '2025-12-04 07:10:37'),
(47, 6708741454, 'SCHO_NEW', NULL, 0, '2025-12-04 07:10:37'),
(51, 680741145, 'line_sent_detail', 12, 0, '2025-12-04 07:14:06'),
(52, 680741145, 'line_sent_detail', 12, 0, '2025-12-11 00:02:22'),
(53, 680741145, 'line_sent_detail', 13, 0, '2025-12-11 00:02:36'),
(54, 680741145, 'new_news', NULL, 0, '2025-12-11 02:42:27'),
(55, 6508907717, 'new_news', NULL, 0, '2025-12-11 02:42:27'),
(56, 6309650916, 'new_news', NULL, 0, '2025-12-11 02:42:27'),
(57, 6708741454, 'new_news', NULL, 0, '2025-12-11 02:42:27'),
(61, 680741145, 'new_news', NULL, 0, '2025-12-11 02:48:02'),
(62, 6508907717, 'new_news', NULL, 0, '2025-12-11 02:48:02'),
(63, 6309650916, 'new_news', NULL, 0, '2025-12-11 02:48:02'),
(64, 6708741454, 'new_news', NULL, 0, '2025-12-11 02:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `std_id` bigint UNSIGNED NOT NULL,
  `user_id` int NOT NULL,
  `std_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `std_lastname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `std_year` int UNSIGNED NOT NULL,
  `std_gpa` decimal(3,2) NOT NULL,
  `std_income` int UNSIGNED NOT NULL,
  `scholarship_interest` tinyint NOT NULL DEFAULT '1',
  `line_user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `line_display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`std_id`, `user_id`, `std_name`, `std_lastname`, `std_year`, `std_gpa`, `std_income`, `scholarship_interest`, `line_user_id`, `line_display_name`, `created_at`, `updated_at`) VALUES
(680741145, 2, 'กิติยาวี', 'ส่องแสง', 2, 3.25, 100000, 5, 'U5e1ec71b2c73a016106e6b64fb5c77d7', 'prae', '0000-00-00 00:00:00', '2025-12-02 16:19:02'),
(6309650916, 6, 'testStd', 'testLastname', 1, 3.00, 120000, 2, NULL, NULL, '2025-12-02 04:33:17', '2025-12-11 01:04:20'),
(6508907717, 4, 'พิชญา', 'ส่องแสง', 1, 3.00, 200000, 1, NULL, NULL, '2025-12-01 23:13:18', '2025-12-02 13:12:21'),
(6708741454, 7, 'ณัฐดนัย ', 'ศรีวัฒน', 3, 3.00, 89000, 4, NULL, NULL, '2025-12-02 16:14:55', '2025-12-02 16:14:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `role` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) NOT NULL,
  `decryption` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role`, `email`, `password`, `decryption`, `phone`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'testAdmin@gmail.com', '$2b$10$Nbtr29E0.o94jbgjvn01Y.rzkFg0K.s9DkRAI/nVCkXdOModJXD.m', '', NULL, 1, '0000-00-00 00:00:00', '2025-12-11 01:03:22'),
(2, 'student', 'daw@gmail.com', '$2b$10$hVcmpvMHF5638HHqPLX.KuFhayc3h.J3sYQQhB./iqukTSbmWYSNW', '', '0944444', 1, '0000-00-00 00:00:00', '2025-12-02 13:43:54'),
(4, 'student', 'pitchaya.j@gmail.com', '$2b$10$Ul5jEtmfvyIG9/tT5Xt/jOC.wieapdY9BhPWbSbCSvTiqNUsFrbiC', '', NULL, 1, '2025-12-01 23:13:18', '2025-12-02 13:43:54'),
(6, 'student', 'TestSTd@gmail.com', '$2b$10$VMz1rSpzPhq93Fu7fsfsX.kc2U382WDwEMLZJ.GP4wz3jYrdteysW', '', NULL, 1, '2025-12-02 04:33:17', '2025-12-11 01:04:42'),
(7, 'student', 'nattadanai.sri@gmail.com', '$2b$10$iFWLzxsiuIMlbO81z0oZYequzxjJ4dWJY5/NGQiL.xw5O/6pqvFaa', '', NULL, 1, '2025-12-02 16:14:55', '2025-12-02 16:14:55');

-- --------------------------------------------------------

--
-- Table structure for table `users_session`
--

CREATE TABLE `users_session` (
  `session_id` int NOT NULL,
  `user_id` int NOT NULL,
  `token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_session`
--

INSERT INTO `users_session` (`session_id`, `user_id`, `token`, `is_active`, `created_at`, `updated_at`) VALUES
(144, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RBZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NjU0MjI5MzYsImV4cCI6MTc2NjAyNzczNn0.-4pYfXB6ayuNzj9-eQG7mAqhf9xJqNHEvdM6pwYfjYg', 1, '2025-12-11 03:15:36', '2025-12-11 03:15:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_id`),
  ADD KEY `User_id` (`user_id`);

--
-- Indexes for table `admin_message`
--
ALTER TABLE `admin_message`
  ADD PRIMARY KEY (`adm_mes_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `admin_notification`
--
ALTER TABLE `admin_notification`
  ADD PRIMARY KEY (`adm_noti_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `admin_notification_ibfk_3` (`student_id`);

--
-- Indexes for table `bookmark`
--
ALTER TABLE `bookmark`
  ADD PRIMARY KEY (`bookmark_id`),
  ADD KEY `Student_id` (`student_id`),
  ADD KEY `scho_id` (`scho_id`);

--
-- Indexes for table `enroll`
--
ALTER TABLE `enroll`
  ADD PRIMARY KEY (`enroll_id`),
  ADD KEY `std_id` (`std_id`),
  ADD KEY `scho_id` (`scho_id`),
  ADD KEY `qua_id` (`qua_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_id`);

--
-- Indexes for table `qualification`
--
ALTER TABLE `qualification`
  ADD PRIMARY KEY (`qua_id`),
  ADD KEY `qua_id` (`qua_id`);

--
-- Indexes for table `scholarship_info`
--
ALTER TABLE `scholarship_info`
  ADD PRIMARY KEY (`scholarship_id`),
  ADD KEY `qualification` (`qualification`);

--
-- Indexes for table `std_notification`
--
ALTER TABLE `std_notification`
  ADD PRIMARY KEY (`std_noti_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`std_id`),
  ADD UNIQUE KEY `std_id` (`std_id`),
  ADD KEY `User_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users_session`
--
ALTER TABLE `users_session`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `session_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `Admin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_message`
--
ALTER TABLE `admin_message`
  MODIFY `adm_mes_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admin_notification`
--
ALTER TABLE `admin_notification`
  MODIFY `adm_noti_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `bookmark`
--
ALTER TABLE `bookmark`
  MODIFY `bookmark_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `enroll`
--
ALTER TABLE `enroll`
  MODIFY `enroll_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `news_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `qualification`
--
ALTER TABLE `qualification`
  MODIFY `qua_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `scholarship_info`
--
ALTER TABLE `scholarship_info`
  MODIFY `scholarship_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `std_notification`
--
ALTER TABLE `std_notification`
  MODIFY `std_noti_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users_session`
--
ALTER TABLE `users_session`
  MODIFY `session_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `admin_message`
--
ALTER TABLE `admin_message`
  ADD CONSTRAINT `admin_message_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`Admin_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admin_notification`
--
ALTER TABLE `admin_notification`
  ADD CONSTRAINT `admin_notification_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`Admin_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `admin_notification_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `student` (`std_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `bookmark`
--
ALTER TABLE `bookmark`
  ADD CONSTRAINT `bookmark_std` FOREIGN KEY (`student_id`) REFERENCES `student` (`std_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `scho_id` FOREIGN KEY (`scho_id`) REFERENCES `scholarship_info` (`scholarship_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enroll`
--
ALTER TABLE `enroll`
  ADD CONSTRAINT `enroll_ibfk_3` FOREIGN KEY (`scho_id`) REFERENCES `scholarship_info` (`scholarship_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `qua_id` FOREIGN KEY (`qua_id`) REFERENCES `qualification` (`qua_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `std_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `scholarship_info`
--
ALTER TABLE `scholarship_info`
  ADD CONSTRAINT `fk_scholarship_qualification` FOREIGN KEY (`qualification`) REFERENCES `qualification` (`qua_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `std_notification`
--
ALTER TABLE `std_notification`
  ADD CONSTRAINT `std_notification_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`std_id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `users_session`
--
ALTER TABLE `users_session`
  ADD CONSTRAINT `session_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
