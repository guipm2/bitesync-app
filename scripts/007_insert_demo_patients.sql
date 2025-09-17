-- Insert demo patients for demonstration
-- Note: This should be run after a user is authenticated
-- Replace the user_id with the actual authenticated user's ID

-- Demo patients with realistic Brazilian names and data
INSERT INTO patients (user_id, full_name, email, phone, birth_date) VALUES
-- These will be inserted via the application interface after authentication
-- The following is template data:

-- ('USER_ID_PLACEHOLDER', 'Arthur Almeida', 'arthur.almeida@email.com', '(11) 99999-1111', '1985-03-15'),
-- ('USER_ID_PLACEHOLDER', 'Carla Martins', 'carla.martins@email.com', '(11) 99999-2222', '1990-07-22'),
-- ('USER_ID_PLACEHOLDER', 'Ricardo Moreira', 'ricardo.moreira@email.com', '(11) 99999-3333', '1988-11-08'),
-- ('USER_ID_PLACEHOLDER', 'Sofia Pereira', 'sofia.pereira@email.com', '(11) 99999-4444', '1992-05-30');

-- Demo bite force readings will be inserted via the application
-- after patients are created and user is authenticated
