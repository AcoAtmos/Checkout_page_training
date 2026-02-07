const helper = require("../../common/helper");

// for product home
exports.getProduct = async (slug) => {
    const query = "SELECT * FROM products WHERE slug = $1";
    const results = await helper.db.query(query, [slug]);
    console.log(results.rows);
    return results.rows[0];
};
