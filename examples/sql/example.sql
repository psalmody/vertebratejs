-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 06, 2015 at 02:25 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `vertebrate_test`
--

CREATE TABLE IF NOT EXISTS `vertebrate_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(35) NOT NULL,
  `mi` varchar(35) NOT NULL,
  `last_name` varchar(35) NOT NULL,
  `age` int(3) NOT NULL,
  `address` varchar(35) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(2) NOT NULL,
  `zip` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `vertebrate_test`
--

INSERT INTO `vertebrate_test` (`id`, `first_name`, `mi`, `last_name`, `age`, `address`, `city`, `state`, `zip`, `email`) VALUES
(1, 'John', 'M', 'Smith', 27, '12345 Somestreet Dr', 'Nowhere', 'AL', '12345', 'jmsmith@nosite.com'),
(2, 'Jane', 'R', 'Doe', 35, '23456 Someplace Cr', 'Somewhere', 'NY', '98754', 'jdoe@cool.co'),
(3, 'John', 'Jacob', 'Jingelheimer', 45, '80 Whenever Dr', 'Goout', 'IL', '12345', 'dadada@dadada.da'),
(4, 'Was', 'A', 'Prince', 55, '268 Formerly Dr', 'Knownas', 'CA', '11111', 'prince@nolonger.com'),
(5, 'Liam', 'I', 'Messy', 35, '125 Footballer Dr', 'Soccer', 'NM', '24356', 'messy@notmessi.com'),
(6, 'Sam', 'I', 'Am', 10, '88 Doctr Dr', 'Seuss', 'ND', '75316', 'idontlikethem@greeneggs.net'),
(7, 'Peter', 'P', 'Cottontail', 1, '12th Row of Carrots', 'Farmerville', 'KS', '12548', 'whatisthis@confused.co.uk');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
