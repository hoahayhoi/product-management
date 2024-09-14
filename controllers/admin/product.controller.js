const Product = require("../../models/product.model");

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

    // Start Pagination
    let limitItems = 4;
    let page = 1;
  
    if(req.query.page) {
      page = parseInt(req.query.page);
    }
  
    if(req.query.limit) {
      limitItems = parseInt(req.query.limit);
    }
  
    const skip = (page - 1) * limitItems;
  
    const totalProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(totalProduct/limitItems);
    // End pagination

    // Query
    const products = await Product.find(find).limit(limitItems).skip(skip); // ***



    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products, 
        totalPage: totalPage,
        currentPage: page
    });
}

// Change status
module.exports.changeStatus = async (req, res) => {
    await Product.updateOne({
        _id: req.body.id
    }, {
        status: req.body.status
    });

    res.json({
        code: "success", 
        mesage: "Đổi trạng thái thành công!"
    });
}
// End change status

// Change status multi
module.exports.changeMulti = async (req, res) => {
    await Product.updateMany({
        _id: req.body.ids
    }, {
        status: req.body.status
    });

    res.json({
        code: "success",
        message: "Đổi trạng thái thành công"
    })
}
// End change status multi

