CREATE TABLE users (
    username PRIMARY KEY,
    displayname VARCHAR(255),
    loginemail VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    aboutme TEXT,
    contactinfo TEXT,
    skills TEXT
);

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

  CREATE TABLE joinedprojects (
    MembersUserName TEXT NOT NULL,
    CreatorUserName TEXT NOT NULL,
    ProjectTitle TEXT NOT NULL,
    dateJoined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (MembersUserName, CreatorUserName, ProjectTitle),
    FOREIGN KEY (MembersUserName) REFERENCES "User" (userName) ON DELETE CASCADE,
    FOREIGN KEY (CreatorUserName, ProjectTitle) REFERENCES Project (creatorUserName, title) ON DELETE CASCADE
);