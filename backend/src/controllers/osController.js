const osService = require('../services/osService')

const osController = {

    create: async (req, res) => {
        try {

            const osData = {
                ...req.body,
                user_id: req.user.id,
                company_id: req.user.companyId
            };  

            const newOs = await osService.createServiceOrder(osData)

            return res.status(201).json({
                success: true,
                message: "Ordem de Serviço aberta com sucesso!",
                data: newOs
            })

        } catch (error) {
            console.error("[ERRO CRIACAO OS]:", error.stack);

            return res.status(400).json({
                success: false,
                message: "Não foi possível abrir a Ordem de Serviço."
            });
        }
    },

    listAll: async (req, res) => {
    try {
        
        const companyId = req.user.companyId; 
        
        const orders = await osService.getAllOrders(companyId);

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        console.error("[ERRO LISTAGEM OS]:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao carregar a lista de ordens de serviço."
        });
    }
},

    getById: async (req, res) => {

        try {
            const { id } = req.params
            const companyId = req.user.companyId;

            const order = await osService.getOrderById(id, companyId)

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: `Não encontramos nenhuma Ordem de Serviço com o número #${id}.`
                })
            }

            return res.status(200).json({
                success: true,
                data: order
            })

        } catch (error) {
            console.error(`[ERRO BUSCA OS ${req.params.id}]:`, error);

            return res.status(500).json({
                success: false,
                message: "Houve um erro técnico ao buscar os detalhes da OS. Por gentileza, entre em contato com o suporte."
            });
        }



    },
    updateStatus: async (req, res) => {
        try {
            return res.status(200).json({ success: true, message: "Status atualizado!" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erro ao atualizar." });
        }
    }
}

module.exports = osController