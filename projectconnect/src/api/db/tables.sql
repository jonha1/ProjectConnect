-- CREATE TABLE "User" (
--     user_id SERIAL PRIMARY KEY, 
--     name TEXT,
--     email TEXT NOT NULL UNIQUE,  
--     password TEXT
-- );


CREATE TABLE Project (
    creatorusername TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    links TEXT,
    memberdescription TEXT,
    memberlinks TEXT,
    membercontactinfo TEXT,
    dateposted TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    isarchived BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (creatorusername, title)
);

CREATE TABLE
  JoinedProjects (
    membersUserName text references "User" (userName) on delete cascade,
    projectID int references Project (projectID) on delete cascade,
    dateJoined timestamp with time zone default current_timestamp,
    primary key (membersUserName, projectID)
  );

CREATE TABLE
  Bookmarks (
    username text,
    title text,
    datebookmarked timestamp with time zone default current_timestamp
  );