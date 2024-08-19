/* jshint esversion: 10 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {isUserAuthenticated} = require('../config/customFunctions');
//const {isUserAdmin} = require('../config/customFunctions');

router.all('/*', /*isUserAdmin,*/isUserAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// Home
router.route('/').get(adminController.index);

// Posts
router.route('/posts').get(adminController.getPosts);

/* Posts */
// Create Posts
router.route('/posts/create').get(adminController.createPostsGet).post(adminController.submitPosts);

// Edit Posts
router.route('/posts/edit/:id').get(adminController.editPostGetRoute).put(adminController.editPostUpdateRoute);

// Delete Posts
router.route('/posts/delete/:id').delete(adminController.deletePost);

/* Categories
// Categories
router.route('/category').get(adminController.getCategories);

// Create Categories
router.route('/category/create').post(adminController.createCategories);

// Edit Categories
router.route('/category/edit/:id').get(adminController.editCategoriesGetRoute).post(adminController.editCategoriesPostRoute);*/

module.exports = router;