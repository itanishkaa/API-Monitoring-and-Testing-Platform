-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Create the user if not exists
CREATE USER IF NOT EXISTS 'sa'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'sa'@'localhost' WITH GRANT OPTION;

-- Create an auto-increment sequence using a table (since MySQL does not support standalone sequences)
CREATE TABLE IF NOT EXISTS SYSTEM_SEQUENCE (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY
);

-- Create the URL_MONITOR table
CREATE TABLE IF NOT EXISTS URL_MONITOR (
    ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    EXPECTED_CONTENT VARCHAR(255),
    HOST_REACHABLE BOOLEAN NOT NULL,
    RESPONSE VARCHAR(255),
    URL VARCHAR(255) NOT NULL
);

-- Enable foreign key checks back
SET FOREIGN_KEY_CHECKS = 1;
