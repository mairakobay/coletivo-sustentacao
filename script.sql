drop database if exists `dbSalad`;
create database `dbSalad`;

use `dbSalad`;

create table `salads` (
    `id` int primary key auto_increment,
    `name` varchar(30) not null,
    `size` char not null,
    `price` decimal (10,2) not null
);

insert into `salads` (`name`, `size`, `price`) values
('Crocante', 'P', 15.00),
('Crocante', 'M', 15.00),
('Crocante', 'G', 15.00),
('Mista', 'P', 20.00),
('Mista', 'M', 20.00),
('Mista', 'G', 20.00),
('Mix bacon', 'P', 22.00),
('Mix bacon', 'M', 22.00),
('Mix bacon', 'G', 22.00),
('Tradicional', 'P', 15.00),
('Tradicional', 'M', 15.00),
('Tradicional', 'G', 15.00),
('Da casa', 'P', 18.00),
('Da casa', 'M', 18.00),
('Da casa', 'G', 18.00),
('Caprese', 'P', 20.00),
('Caprese', 'M', 20.00),
('Caprese', 'G', 20.00);




CREATE TABLE `user` (
	`id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
   	`name` VARCHAR(50) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL
);

INSERT INTO `user` (`name`, `email`, `password`,) VALUES
('Maira Kobayashi', 'mairakobay@gmail.com', '123456'),
('Wilson Rodrigues', 'wilson@gmail.com','123456'),
('Maria Inalda', 'nalda@gmail.com',' 123456'),
('João Silva', 'joaosilva@hotmail.com', '123456'),
('Maria Santos', 'mariasantos@hotmail.com', '123456'),
('Ricardo Reis', 'ricardoreis@hotmail.com', '123456');




