
const {db} = require("../../common/helper");
const bcrypt = require("bcrypt");
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
        result.status = "failed";
        throw new Error ("Invalid payload");
    }
    if (result.payload.username === "" || result.payload.username === null || result.payload.username === undefined){
        result.message("Username is required");
        result.code = 400;
        result.status = "failed";
        throw new Error ("Username is required");
    }
    if (result.payload.email === "" || result.payload.email === null || result.payload.email === undefined){
        result.message("Email is required");
        result.code = 400;
        result.status = "failed";
        throw new Error ("Email is required");
    }
    if (result.payload.phone === "" || result.payload.phone === null || result.payload.phone === undefined){
        result.message("Phone is required");
        result.code = 400;
        result.status = "failed";
        throw new Error ("Phone is required");
    }
    if (result.payload.payment_method === "" || result.payload.payment_method === null || result.payload.payment_method === undefined){
        result.message("Payment method is required");
        result.code = 400;
        result.status = "failed";
        throw new Error ("Payment method is required");
    }
    if (result.payload.product === "" || result.payload.product === null || result.payload.product === undefined){
        result.message("Product is required");
        result.code = 400;
        result.status = "failed";
        throw new Error ("Product is required");
    }
    if (result.payload.terms == false){
        result.message("Terms and conditions must be accepted");
        result.code = 400;
        result.status = "failed";
        throw new Error ("Terms and conditions must be accepted");
    }
    return result;
}
exports.getPrice = async (result) => {
    try{
        const rows = await db.query("SELECT price FROM products WHERE slug = $1", [result.payload.product]);
        if (rows.length == 0 ){
            result.message("Product not found");
            result.code = 400;
            result.status = "failed";
            throw new Error("Product not found");
        }
        result.payload.price = rows.price;
    }catch(err){
        result.message("Get price failed");
        result.code = 400;
        result.status = "failed";
        throw new Error("Get price failed");
    }
    return result;
}
exports.countTotal = async (result) => {
    try{
        result.payload.total = result.payload.price * result.payload.amount;
    }catch(err){
        result.message("Count total failed");
        result.code = 400;
        result.status = "failed";
        throw new Error("Count total failed");
    }
    return result;
}

// ============= CHECKOUT AUTH ==============

exports.checkout_add_user = async (result) => {
  if (result.status === "failed") return result;

  try {
    const userResult = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [result.payload.email]
    );

    // user belum ada
    if (userResult.rows.length === 0) {

      if (!result.payload.password) {
        result.status = "failed";
        result.code = 400;
        result.message = "Password is required";
        throw new Error("Password is required");
      }
      const hashedPassword = await bcrypt.hash(result.payload.password, 10);
      const insertResult = await db.query(
        `INSERT INTO users (email, phone, username, password, terms)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [
          result.payload.email,
          result.payload.phone,
          result.payload.username,
          hashedPassword,
          result.payload.terms
        ]
      );

      result.payload.idUser = insertResult.rows[0].id;

    } else {
      // user sudah ada
      result.payload.idUser = userResult.rows[0].id;
    }

    result.status = "success";
    result.code = 200;
    result.message = "Success";
    return result;

  } catch (err) {
    result.status = "failed";
    result.code = 500;
    result.message = "Create account failed";
    throw err;
  }
};


exports.checkout_send_whatsapp = async (result)=>{
    if (result.status == 'failed') { return result; }
    result.payload.message = `Halo ${result.payload.username}, terima kasih telah melakukan pembelian. Berikut adalah detail pembelian Anda:
    
    Produk: ${result.payload.product}
    Harga: ${result.payload.price}
    Total: ${result.payload.total}
    
    Silahkan lakukan pembayaran ke rekening berikut:
    Bank: BCA
    No. Rekening: 1234567890
    Atas Nama: PT. Billing Digital Indonesia
    
    Setelah melakukan pembayaran, silahkan konfirmasi ke nomor WhatsApp berikut: 0000000000
    
    Terima kasih.`;
    try{
        const {send_whatsapp} = require("../whatsapp/whatsapp_service");
        result = await send_whatsapp(result);
        result.message = "Send whatsapp success";
        result.code = 200;
        result.status = "success";
    }catch(err){
        result.message = "Send whatsapp failed";
        result.code = 400;
        result.status = "fail";
        throw new Error(err);
    }
    return result;
}
exports.createResponse =async (result) =>{
    let res = {
        code : result.code,
        status : result.status,
        message : result.message
    }
    return res;
}