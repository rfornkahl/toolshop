create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(60),
    password varchar(50),
    status varchar(50),
    role varchar(20),
    token varchar(20),
    securityQuestion varchar(100),
    securityQuestionAnswer varchar (100),
    UNIQUE (email)
);

insert into user(name, contactNumber, email, password, status, role, token) values ('Admin', '5555555555', 'fake@gmail.com', 'admin', 'true', 'admin');

create table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
);

create table product(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    categoryId int NOT NULL,
    description varchar(255),
    price int,
    quantity int,
    status varchar(20),
    primary key(id)
);

create table billing(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(200) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar (255) NOT NULL,
    contactNumber varchar (20) NOT NULL,
    streetAddress varchar (100) NOT NULL,
    city varchar (50) NOT NULL,
    state varchar (10) NOT NULL,
    zipCode int (10) NOT NULL,
    paymentMethod varchar (50) NOT NULL,
    total int NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy varchar(255) NOT NULL,
    primary key(id)
);