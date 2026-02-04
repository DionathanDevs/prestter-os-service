const { DataTypes } = require('sequelize');
const sequelize = require('../database/mysql');

const ServiceOrder = sequelize.define('ServiceOrder', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    // Adicionado: Essencial para a segurança multi-tenant da sua oficina
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    car_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('open', 'budget', 'approved', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'open'
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    // Adicionado: Campo para notas técnicas ou observações do cliente
    observation: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'service_orders',
    timestamps: true, 
    underscored: true // Garante que o Sequelize busque 'created_at' e não 'createdAt'
});

module.exports = ServiceOrder;