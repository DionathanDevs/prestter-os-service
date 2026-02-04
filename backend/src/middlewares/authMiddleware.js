const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({
            success: false,
            message: "Token não fornecido. Acesso negado."
        })
    }

    const parts = authHeader.split(' ')

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token malformatado" });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id || !decoded.companyId) {
        return res.status(401).json({ success: false, message: "Token sem identificação de usuário." });
        
    }
       req.user = {
        id: decoded.id,
        companyId: decoded.companyId
    };

        return next(); 
        
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Token inválido ou expirado."
        });
    }
}