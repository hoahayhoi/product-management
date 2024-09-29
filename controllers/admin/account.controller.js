
module.exports.index = async (req, res) => {
    res.render("admin/pages/accounts/index", {
        pageTitle: "Tài khoản quản trị"
    });
}