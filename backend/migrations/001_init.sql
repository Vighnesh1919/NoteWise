CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255) DEFAULT 'Untitled',
    content JSONB DEFAULT '[]',

    parent_id UUID REFERENCES notes(id) ON DELETE CASCADE, 
    is_favorite BOOLEAN DEFAULT FALSE,                     
    is_deleted BOOLEAN DEFAULT FALSE,    
     deleted_at TIMESTAMP,                 

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);