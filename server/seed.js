
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs'); // Using bcrypt for hashing passwords

// Initial user data from the original mock API
const initialUsers = [
    { id: 'user-1', firstName: 'Amina', lastName: 'El Fassi', email: 'chef.production@asment.ma', role: 'Chef de Département', department: 'Production', avatarUrl: 'https://picsum.photos/id/1027/100/100' },
    { id: 'user-2', firstName: 'Youssef', lastName: 'Alami', email: 'ilyass.ait@asment.ma', role: 'Ingénieur', department: 'Maintenance', avatarUrl: 'https://picsum.photos/id/1005/100/100' },
    { id: 'user-3', firstName: 'Karim', lastName: 'Tazi', email: 'ahmed.tech@asment.ma', role: 'Technicien', department: 'Maintenance', avatarUrl: 'https://picsum.photos/id/1011/100/100', phone: '+212 6 12 34 56 78'},
    { id: 'user-4', firstName: 'Fatima', lastName: 'Idrissi', email: 'fatima.zahra@asment.ma', role: 'Technicien', department: 'Production', avatarUrl: 'https://picsum.photos/id/1025/100/100' },
    { id: 'user-5', firstName: 'Omar', lastName: 'Berrada', email: 'rachid.ouafi@asment.ma', role: 'Technicien', department: 'Technologies Opérationnelles', avatarUrl: 'https://picsum.photos/id/1012/100/100' },
    { id: 'user-6', firstName: 'Kenza', lastName: 'Bennani', email: 'aicha.bennani@asment.ma', role: 'Ingénieur', department: 'Qualité & Contrôle', avatarUrl: 'https://picsum.photos/id/1013/100/100' },
    { id: 'user-admin', firstName: 'Said', lastName: 'Alaoui', email: 'admin@asment.ma', role: 'Admin', department: 'Administration & RH', avatarUrl: 'https://picsum.photos/id/10/100/100' },
];

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function seedDatabase() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Seeding users...');

        // In a real app, never store plain text passwords. We hash it.
        const demoPassword = 'demo123';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(demoPassword, salt);

        for (const user of initialUsers) {
            await client.query(
                `INSERT INTO users (id, first_name, last_name, email, role, department, avatar_url, phone, password_hash)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (email) DO NOTHING;`, // Avoids errors if you run it multiple times
                [user.id, user.firstName, user.lastName, user.email, user.role, user.department, user.avatarUrl, user.phone, passwordHash]
            );
        }

        console.log('Successfully seeded users table.');
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error seeding database:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

// We need bcryptjs, let's install it first.
// The user will need to run `npm install bcryptjs` in the server directory.
// Let's add a note about that.
console.log('NOTE: Make sure you have run "npm install bcryptjs" in the server directory before running this seed script.');
seedDatabase();
