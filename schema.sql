DROP DATABASE IF EXISTS day_planner_db;
CREATE DATABASE day_planner_db;

USE day_planner_db;

CREATE TABLE plans (
	id INT NOT NULL AUTO_INCREMENT,
	plan varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO plans (plan) VALUES ('Aug 15th 5.45pm Bryson');
