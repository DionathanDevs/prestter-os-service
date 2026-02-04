require('dotenv').config();
const mongoose = require('mongoose');

async function connectDb() {
    try {
        
        const options = {
            maxPoolSize: 10,             // Semelhante ao 'max' do pool no MySQL
            minPoolSize: 2,              // Mantém conexões prontas para agilizar o checklist
            serverSelectionTimeoutMS: 5000, // Semelhante ao 'acquire' (desiste após 5s)
            socketTimeoutMS: 45000,      // Fecha conexões ociosas (semelhante ao 'idle')
            family: 4                    
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log('MongoDB: Conectado com sucesso e pool configurado.');
    } catch (err) {
        console.error('MongoDB: Falha crítica na conexão -> ' + err.message);
        process.exit(1); 
    }
}

module.exports = connectDb;