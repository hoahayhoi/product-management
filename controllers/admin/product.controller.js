const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");

module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    });
}

module.exports.createPost = async (req, res) => {
    if (!req.body) {
        return res.json({ code: 'error', message: 'Data not found!' });
    }

    if (req.file) {
        req.body.thumbnail = req.file.filename;
    }

    if (!req.body.position) {
        const countRecords = await Product.countDocuments();
        req.body.position = countRecords + 1;
    }

    const productData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price ? parseFloat(req.body.price) : 0,
        discountPercentage: req.body.discountPercentage ? parseFloat(req.body.discountPercentage) : 0,
        stock: req.body.stock ? parseInt(req.body.stock) : 0,
        thumbnail: req.body.thumbnail,
        status: req.body.status,
        position: req.body.position ? parseInt(req.body.position) : 0,
        deleted: req.body.deleted ? (req.body.deleted === 'true' || req.body.deleted === true) : false
    };

    await Product.create(productData);
    req.flash('success', 'Tạo mới thành công!');
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

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

    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }

    // End Search  

    // Start Pagination
    let limitItems = 4;
    let page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page);
    }

    if (req.query.limit) {
        limitItems = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItems;

    const totalProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(totalProduct / limitItems);
    // End pagination

    // Query
    const products = await Product.find(find)
        .limit(limitItems)
        .skip(skip)
        .sort({ position: 'desc' });


    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        totalPage: totalPage,
        currentPage: page
    });
}

module.exports.changePosition = async (req, res) => {
    if (!req.body) {
        return res.json({ code: 'error', message: 'Position not found!' });
    }

    await Product.updateOne({
        _id: req.body.id
    }, {
        position: req.body.position
    })

    req.flash('success', 'Đổi vị trí thành công!');
    res.json({ code: 'success', message: 'Change position successfully!' });
}

// Change status
module.exports.changeStatus = async (req, res) => {
    await Product.updateOne({
        _id: req.body.id
    }, {
        status: req.body.status
    });


    req.flash('success', 'Đổi trạng thái thành công!');
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
            req.flash('success', 'Đổi trạng thái thành công!');
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
            req.flash('success', 'Xoá thành công!');
            res.json({ code: 'success', message: "Delete successfully!" });
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
    await Product.updateOne({ _id: req.body.id }, { deleted: true });


    req.flash('success', 'Xoá thành công!');
    res.json({
        code: "success",
        mesage: "Xoá mềm thành công!"
    });
}
// End delete softly

// edit product change page
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id,
        deleted: false
    });
    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product
    });
}
// End edit product change page

// Edit 
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    await Product.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
}

// End edit
