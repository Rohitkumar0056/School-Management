import pool from '../config/db.js';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * 
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

export const addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;
        const [result] = await pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.status(201).json({
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding school' });
    }
};

export const listSchools = async (req, res) => {
    try {
        const userLat = parseFloat(req.query.latitude);
        const userLon = parseFloat(req.query.longitude);
        
        if (isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ message: 'Coordinates must be numbers' });
        }

        if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
            return res.status(400).json({ 
                message: 'Invalid coordinates',
                details: {
                    valid_ranges: {
                        latitude: '-90 to 90',
                        longitude: '-180 to 180'
                    }
                }
            });
        }

        const [schools] = await pool.query('SELECT * FROM schools');
        
        const schoolsWithDistance = schools.map(school => ({
            ...school,
            distance: calculateDistance(
                userLat,
                userLon,
                school.latitude,
                school.longitude
            )
        }));

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving schools' });
    }
};