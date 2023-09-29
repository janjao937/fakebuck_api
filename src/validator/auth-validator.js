const Joi = require("joi");

// const registerSchema =joi.object({
//     firstName:joi.string().trim().required(),
//     lastName:joi.string().trim().required(),
//     //joi alternative //https://joi.dev/api/?v=17.9.1#alternativesmatchmode
//     emailOrMobile:joi.alternatives([
//         joi.string().email(),joi.string().pattern(/^[0-9]{10}$/).required()//Regular_expressions
//     ]).strip(),
//     password:joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/).trim().required(),//Regular_expressions ความหมาย ต้องมีa-z A-Z 0-9 |6-30 ตัว
//     confirmPassword : joi.string().valid(joi.ref("password")).trim().required().strip(),//strip() ให้ตัดหลังจาก validate
//     mobile:joi.forbidden().when("emailOrMobile",{is:joi.string().pattern(/^[0-9]{10}$/)}),
//     then:joi.string().default(joi.ref("emailOrMobile")),
//     email:joi.forbidden().when("emailOrMobile",{
//         is:joi.string().email(),
//         then:joi.string().default(joi.ref("emailOMobile"))
//     })
// });

//joiObj().validate return {value,error}

const registerSchema = Joi.object(
    {
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        emailOrMobile: Joi.alternatives([
            Joi.string().email(),
            Joi.string().pattern(/^[0-9]{10}$/).required(),
        ]).strip(),

        password: Joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/).trim().required(),

        confirmPassword: Joi.string().valid(Joi.ref("password")).trim().required().strip(),

        mobile: Joi.forbidden().when("emailOrMobile", {
            is: Joi.string().pattern(/^[0-9]{10}$/),
            then: Joi.string().default(Joi.ref("emailOrMobile")),
        }),
        email: Joi.forbidden().when("emailOrMobile", {
            is: Joi.string().email(),
            then: Joi.string().default(Joi.ref("emailOrMobile")),
        }),
    }
);

const loginSchema =Joi.object({
    emailOrMobile : Joi.string().required(),
    password:Joi.string().required()
});

exports.loginSchema = loginSchema;
exports.registerSchema = registerSchema;