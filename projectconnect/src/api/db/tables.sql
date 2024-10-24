CREATE TABLE user_account (
    user_id SERIAL PRIMARY KEY, 
    name TEXT,
    email TEXT NOT NULL UNIQUE,  
    password TEXT
);


CREATE TABLE posts (
    PostID VARCHAR(255) NOT NULL,
    UserID VARCHAR(255) NOT NULL,  
    PostName TEXT NOT NULL,
    Description VARCHAR(255),
    MemberNames VARCHAR(255),
    IsOpen BOOLEAN NOT NULL,
    Links VARCHAR(255),
    Tags VARCHAR(255),
    MoreInfo VARCHAR(255),
    MoreContactInfo VARCHAR(255),
    PRIMARY KEY (PostID)
);
