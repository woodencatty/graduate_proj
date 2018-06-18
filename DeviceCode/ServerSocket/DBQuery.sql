CREATE TABLE `medic` (  `employeeNumber` varchar(45) NOT NULL,  `id` varchar(45) NOT NULL,  `password` varchar(45) NOT NULL,  `name` varchar(45) NOT NULL,  `belong` varchar(45) NOT NULL,  `contact` varchar(45) NOT NULL,  `address` varchar(45) NOT NULL,  `birth` date NOT NULL,  PRIMARY KEY (`employeeNumber`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `patient` (  `patientNumber` varchar(45) NOT NULL,  `patientName` varchar(45) NOT NULL,  `patientDisease` varchar(45) NOT NULL DEFAULT '',  `patientStatus` varchar(45) NOT NULL DEFAULT '',  `patientProgram` varchar(255) DEFAULT NULL,  `employeeNumber` varchar(45) DEFAULT NULL,  PRIMARY KEY (`patientNumber`),  KEY `program_1` (`patientProgram`),  KEY `employeeNumber` (`employeeNumber`),  CONSTRAINT `employeeNumber` FOREIGN KEY (`employeeNumber`) REFERENCES `medic` (`employeeNumber`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `device` (  `deviceNumber` varchar(10) NOT NULL,  `version` varchar(45) NOT NULL,  `sort` varchar(45) NOT NULL,  `activated` tinyint(1) NOT NULL,  `ipv4_address` varchar(45) DEFAULT NULL,  `ipv6_address` varchar(45) DEFAULT NULL,  `place` varchar(45) DEFAULT NULL,  `patientNumber` varchar(45) DEFAULT NULL,  PRIMARY KEY (`deviceNumber`),  KEY `patientNumber` (`patientNumber`),  CONSTRAINT `patientNumber` FOREIGN KEY (`patientNumber`) REFERENCES `patient` (`patientNumber`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `program` (  `programNumber` varchar(45) NOT NULL DEFAULT '',  `name` varchar(30) NOT NULL,  `content` varchar(255) NOT NULL,  `corrDisease` varchar(255) NOT NULL,  `StartPoster` varchar(10) DEFAULT NULL,  `ArrivePoster` varchar(10) DEFAULT NULL,  `dist` int(11) DEFAULT NULL,  PRIMARY KEY (`programNumber`),  KEY `StartPoster` (`StartPoster`),  KEY `ArrivePoster` (`ArrivePoster`),  CONSTRAINT `ArrivePoster` FOREIGN KEY (`ArrivePoster`) REFERENCES `device` (`deviceNumber`),  CONSTRAINT `StartPoster` FOREIGN KEY (`StartPoster`) REFERENCES `device` (`deviceNumber`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `exercise` (  `exerciseNum` varchar(45) NOT NULL DEFAULT '',  `patientNum` varchar(45) DEFAULT NULL,  `programNum` varchar(45) DEFAULT NULL,  `exerciseTime` date DEFAULT NULL,  `DailyStep` int(11) DEFAULT NULL,  PRIMARY KEY (`exerciseNum`),  KEY `FK_patientNum` (`patientNum`),  KEY `FK_programNum` (`programNum`),  CONSTRAINT `FK_patientNum` FOREIGN KEY (`patientNum`) REFERENCES `patient` (`patientNumber`) ON DELETE CASCADE ON UPDATE CASCADE,  CONSTRAINT `FK_programNum` FOREIGN KEY (`programNum`) REFERENCES `program` (`programNumber`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;