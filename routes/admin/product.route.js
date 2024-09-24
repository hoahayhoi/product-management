const express = require("express");

const router = express.Router();

const multer = require('multer');

const upload = multer();

const controller = require('../../controllers/admin/product.controller');
const validate = require("../../validates/admin/product.validate");

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get("/", controller.index);
router.get('/create', controller.create);

router.post('/create', 
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost, 
    controller.createPost
);

router.patch("/change-status", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);
router.patch("/change-position", controller.changePosition);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.editPatch
);

router.get("/detail/:id", controller.detail);

router.patch("/delete", controller.delete);

module.exports = router;


