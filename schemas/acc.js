const Joi = require('joi');

module.exports = {
    AccSchema: Joi.object({
        email: Joi.string().email().required().messages({
            "any.required": "email là trường bắt buộc",
            "string.email": "email không hợp lệ",
            "string.empty": "email không được để trống"
        }),
        
        password: Joi.string().min(8).required().messages({
            "any.required": "mật khẩu là trường bắt buộc",
            "string.min": "mật khẩu phải có ít nhất {#limit} ký tự",
            "string.empty": "mật khẩu không được để trống"
        })
    })
};
