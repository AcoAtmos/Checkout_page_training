
const {db} = require("../../common/helper");
const {register} = require("../auth/auth_service");
// ============= CHECKOUT PROCESS =============
exports.capturePayload = async (data) =>{
    let username = data?.username;
    let email = data?.email;
    let password = data?.password;
    let phone = data?.phone;
    let payment_method = data?.payment_method;
    let product = data?.product;
    let amount = data?.amount;
    let discount = data?.discount;
    let terms = data?.terms;

    let result = {
        payload : {
            username : username,
            email : email,
            password : password || "",
            phone : phone,
            payment_method : payment_method,
            product : product,
            amount : amount || 1,
            discount : discount || 0,
            terms : terms || true
        },
        code : 200,
        status : "success",
        message : "Success",
        data : {}

    }
    return result;
}
exports.validatePayload = async (result) =>{
    if (result.status !== "success"){
        result.message("Invalid payload");
        result.code = 400;
        result.status = "error";
        throw new Error (err);
    }
    if (result.payload.username === "" || result.payload.username === null || result.payload.username === undefined){
        result.message("Username is required");
        result.code = 400;
        result.status = "error";
        throw new Error (err);
    }
    if (result.payload.email === "" || result.payload.email === null || result.payload.email === undefined){
        result.message("Email is required");
        result.code = 400;
        result.status = "error";
        throw new Error (err);
    }
    if (result.payload.phone === "" || result.payload.phone === null || result.payload.phone === undefined){
        result.message("Phone is required");
        result.code = 400;
        result.status = "error";
        throw new Error (err);
    }
    if (result.payload.payment_method === "" || result.payload.payment_method === null || result.payload.payment_method === undefined){
        result.message("Payment method is required");
        result.code = 400;
        result.status = "error";
        throw new Error (err);
    }
    if (result.payload.product === "" || result.payload.product === null || result.payload.product === undefined){
        result.message("Product is required");
        result.code = 400;
        result.status = "error";
        throw new Error (err);
    }
    if (result.payload.terms == false){
        result.message("Terms and conditions must be accepted");
        result.code = 400;
        result.status = "error";
        throw new Error (err);
    }
    return result;
}
exports.getPrice = async (result) => {
    try{
        const [rows] = await db.query("SELECT price FROM products WHERE code = ?", [result.payload.product]);
        if (rows.length == 0 ){
            throw new Error("Product not found");
        }
        result.payload.price = rows[0].price;
    }catch(err){
        throw new Error(err);
    }
    return result;
}
exports.countTotal = async (result) => {
    try{
        result.payload.total = result.payload.price * result.payload.amount;
    }catch(err){
        throw new Error(err);
    }
    return result;
}

// ============= CHECKOUT AUTH ==============

exports.checkout_add_user = async (result) =>{
    try{
        const idUser = await db.query("SELECT id FROM users WHERE email = ?", [result.payload.email]);
        // kalau user tidak di temukan maka akan di buatkan user baru
        if (idUser.length == 0 ){
            // cek password kalau user tidak di temukan
            if (result.payload.password === "" || result.payload.password === null || result.payload.password === undefined){
                throw new Error("Password is required");
            }
            const query = `INSERT INTO users (email, phone, name, password, terms) VALUES ($1, $2, $3, $4, $5)`;

                const [rows] = await db.query(query, [result.payload.email, result.payload.phone, result.payload.username, result.payload.password, result.payload.terms]);
                result.payload.idUser = rows[0].id;
        }else{
            // kalau user di temukan 
            result.payload.idUser = idUser[0].id;
        }
        result.code = 200;
        result.status = "success";
        result.message = "Success";
        return result;
    }catch(err){
        result.message("Create account failed");
        result.code = 400;
        result.status = "error";
        throw new Error (err); 
    }
};


exports.createResponse =async (result) =>{
    let res = {
        code : 200,
        status : "success",
        message : "Success",
        data : {} 
    }
}