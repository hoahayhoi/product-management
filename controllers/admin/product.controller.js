const Product = require("../../models/product.model");
const productModel = require("../../models/product.model");

module.exports.index = async (req, res) => {
    // Search default
    const find = {
        deleted: false
    }

    // Fillter
    if (req.query.status) {
        find.status = req.query.status
    }
    // End fillter

    // Search

    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }

    // End Search  

    const products = await productModel.find(find);

    console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products
    });
}