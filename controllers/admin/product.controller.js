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
    switch (req.body.status) {
        case 'active':
        case 'inactive':
            await Product.updateMany({
                _id: req.body.ids
            }, {
                status: req.body.status
            });
            res.json({
                code: 'success',
                message: 'Change status succcessfully!'
            });
            break;
        case 'delete':
            await Product.updateMany({
                _id: req.body.ids
            }, {
                deleted: true
            })
            res.json({code: 'success', message: "Delete successfully!"});
            break;
        default:
            res.json({
                code: 'error',
                message: 'Invalid status!'
            })
            break;
    }
}
// End change status multi

// // Delete permanent 
// module.exports.delete = async (req, res) => {
//     await Product.deleteOne({_id: req.body.id});

//     res.json({
//         code: "success", 
//         mesage: "Xoá vĩnh viễn thành công!"
//     }); 
// }
// // End delete permanent 

// Delete softly
module.exports.delete = async (req, res) => {
    await Product.updateOne({_id: req.body.id}, {deleted: true});

    res.json({
        code: "success", 
        mesage: "Xoá mềm thành công!"
    }); 
}
// End delete softly
