-- Insert sample users
INSERT INTO "user" (userName, displayName, loginEmail, password, aboutMe, contactInfo, skills)
VALUES 
    ('alice', 'Alice Smith', 'alice@example.com', 'securepassword1', 'Alice is a software engineer.', 'alice_contact_info', 'Python, SQL'),
    ('bob', 'Bob Jones', 'bob@example.com', 'securepassword2', 'Bob is a data analyst.', 'bob_contact_info', 'Excel, SQL, Python'),
    ('charlie', 'Charlie Brown', 'charlie@example.com', 'securepassword3', 'Charlie is a project manager.', 'charlie_contact_info', 'Management, Planning')
ON CONFLICT (userName) DO NOTHING;

-- -- Insert sample projects (Make sure this comes before Notification, Bookmark, and JoinedProjects)
INSERT INTO Project (creatorUserName, title, description, links, memberDescription, memberLinks, memberContactInfo, isArchived)
VALUES 
    ('alice', 'Green Energy', 'Project on solar energy', 'https://example.com/green_energy', 'Engineers and Analysts', 'https://linkedin.com/green_team', 'green_team_contact', false),
    ('bob', 'Water Conservation', 'Save water project', 'https://example.com/water_conservation', 'Scientists and Researchers', 'https://linkedin.com/water_team', 'water_team_contact', false),
    ('charlie', 'AI Research', 'Research on AI trends', 'https://example.com/ai_research', 'AI Experts', 'https://linkedin.com/ai_team', 'ai_team_contact', true)
ON CONFLICT DO NOTHING;

-- -- Insert sample notifications
INSERT INTO Notification (notificationid, toUserID, fromUserID, messageType, title, datesent )
VALUES 
    (1, 'bob', 'alice', 'Invite', 'Water Conversation', CURRENT_TIMESTAMP),
    (2,'alice', 'bob', 'Message', 'Green Energy', CURRENT_TIMESTAMP),
    (3, 'charlie', 'bob', 'Alert', 'AI Research', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- -- Insert sample bookmarks
INSERT INTO Bookmark (username, title, dateBookmarked)
VALUES 
    ('alice', 'Green Energy', CURRENT_TIMESTAMP),
    ('bob', 'Green Energy', CURRENT_TIMESTAMP),
    ('charlie', 'Green Energy', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- -- Insert sample joined projects changeee
INSERT INTO joinedProject (membersUserName, projectTitle, creatorUserName, dateJoined)
VALUES 
    ('alice', 'AI Research', 'charlie',CURRENT_TIMESTAMP),
    ('bob', 'Green Energy', 'alice',CURRENT_TIMESTAMP),
    ('charlie', 'Green Energy', 'alice', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
