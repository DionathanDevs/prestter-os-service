const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
    login: async (req, res) => {
        try{
            const {email, password} = req.body;

            const user = await User.findOne({where: {email}})

            if(!user){
                return res.status(401).json({
                    success: false,
                    message: "E-mail ou senha inválidos."
                })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if(!isPasswordValid){

                return res.status(401).json({
                    success: false,
                    message: "E-mail ou senha inválidos."
                })

            }

            const token = jwt.sign(
                { id: user.id, companyId: user.company_id }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' } // Token vale por 1 dia
            )

            return res.status(200).json({
                success: true,
                message: "Login realizado com sucesso!",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        }catch(error){
        console.error("[ERRO LOGIN]:", error);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao processar o login."
            });
    }
    },

    register: async (req, res) => {
        console.log(req.body)
        try{
            const { first_name, last_name, email, password, company_id } = req.body;

            const userExists = await User.findOne({where: {email}})

            if(userExists){
                return res.status(400).json({
                    success: false,
                    message: "Este e-mail já está em uso."
                })
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                company_id,
                is_active: true
            });

            return res.status(201).json({
                success: true,
                message: "Usuário cadastrado com sucesso!",
                user: {
                    id: newUser.id,
                    email: newUser.email
                }
            });


        }catch(error){
            console.error("[ERRO REGISTRO]:", error);
            return res.status(500).json({
                success: false,
                message: "Erro técnico ao realizar o cadastro."
            })
        }
    }
}

module.exports = authController