const ServiceOrder = require('../models/ServiceOrder')
const OsDetailsMongo = require('../models/osDetails')

const osService = {

    createServiceOrder: async (data) => {
        const {customer_id, car_id, items, checklist, pictures} = data;

        try{

            const total_amount = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)

            const newOsMySql = await ServiceOrder.create({
                customer_id,
                car_id,
                total_amount,
                status: 'open',
                company_id: data.company_id,
                user_id: data.user_id
            });

            const newOsMongo = await OsDetailsMongo.create({
                mysql_os_id: newOsMySql.id,
                checklist: checklist,
                pictures: pictures,
                internal_notes: []
            })

            return {
                ...newOsMySql.toJSON(),
                details: newOsMongo.toJSON()
            };

        }catch(error){
           if (error.name === 'SequelizeForeignKeyConstraintError') {
            const field = error.fields[0]; // O Sequelize nos diz qual campo falhou
            
            const messages = {
                customer_id: "O cliente informado não existe no sistema.",
                car_id: "O veículo informado não foi encontrado.",
                user_id: "O mecânico/usuário informado não é válido.",
                company_id: "A empresa (oficina) informada não existe."
            };

            throw new Error(messages[field] || "Um dos registros vinculados não foi encontrado.");
        }

        // 2. Erro de Banco de Dados Genérico (ex: coluna faltando)
        if (error.name === 'SequelizeDatabaseError') {
            console.error("[DATABASE ERROR]:", error.parent.sqlMessage);
            throw new Error("Erro de estrutura no banco de dados. Contate o suporte.");
        }
        }

        
    },

    getOrderById: async (id) => {
        const osBase = await ServiceOrder.findByPk(id)
        if(!osBase) return null

        const osExtra = await OsDetailsMongo.findOne({mysql_os_id: id})

        return {
            ...osBase.toJSON(),
            checklist: osExtra?.checklist || {},
            pictures: osExtra?.pictures || []
        }
    },

    getAllOrders: async(company_id) => {
        const orders = await ServiceOrder.findAll({
            where: {company_id},
            order: [['created_at', 'DESC']]
        })

        if(orders.length === 0) return []

        const osIds = orders.map(os => os.id)

        const details = await OsDetailsMongo.find({
        mysql_os_id: { $in: osIds }
        })

        const detailsMap = details.reduce((acc, curr) => {
        acc[curr.mysql_os_id] = curr;
        return acc;
          }, {});

        return orders.map(os => {
        const extra = detailsMap[os.id];
        
        return {
            ...os.toJSON(),
            checklist_summary: extra ? Object.keys(extra.checklist).length : 0,
            has_pictures: extra?.pictures?.length > 0
        };
    });

    }

    
}

module.exports = osService