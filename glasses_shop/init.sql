CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    formed_at TIMESTAMP,
    completed_at TIMESTAMP,
    creator_id INTEGER REFERENCES users(id),
    moderator_id INTEGER REFERENCES users(id)
);

CREATE TABLE request_services (
    request_id INTEGER REFERENCES requests(id),
    service_id INTEGER REFERENCES services(id),
    PRIMARY KEY (request_id, service_id)
);

INSERT INTO users (username, email, role) VALUES
('тапок', 'mail@mail.com', 'user'),
('хомяк', 'smail@mail.com', 'moderator');

INSERT INTO services (name, price, image, status) VALUES
('Солнцезащитные очки', 150.00, 'images/sunglasses.png', 'active'),
('Очки для чтения', 75.50, 'images/readingglasses.png', 'active');