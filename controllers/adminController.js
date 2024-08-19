/* jshint esversion: 10 */
const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const {isEmpty} = require('../config/customFunctions');

module.exports = {
    // Home
    index: (req, res) => {
        res.render('admin/index');
    },

    getPosts: (req, res) => {
        Post.find().lean().populate('category').then(posts => {
            res.render('admin/posts/index', {posts: posts});
        });
    },

    createPostsGet: (req, res) => {
        Category.find().lean().then(cats =>{
            res.render('admin/posts/create', {categories: cats});
        });
    },

    submitPosts: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true: false;

        let filename = '';

        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir + filename, (err) => {
                if (err) throw err;
            });
        }

        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            //category: req.body.category,
            file: `/uploads/${filename}`
        });

        newPost.save().then(post => {
            req.flash('success-message', 'News wurde erfolgreich erstellt.');
            res.redirect('/admin/posts');
        });
    },

    editPostGetRoute: (req, res) => {
        const id = req.params.id;

        Post.findById(id).lean().then(post => {
            Category.find().lean().then(cats => {
                res.render('admin/posts/edit', {post: post/*, categories: cats*/});
            });
        });
    },

    editPostUpdateRoute: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true: false;
        const id = req.params.id;

        Post.findById(id).then(post => {
            post.title = req.body.title;
            post.status = req.body.status;
            post.allowComments = commentsAllowed;
            post.description = req.body.description;
            //post.category = req.body.category;

            post.save().then(updatePost => {
                req.flash('success-message', `Post ${updatePost.title} wurde bearbeitet!`);
                res.redirect('/admin/posts');
            });
        });
    },

    deletePost: (req, res) => {
        Post.findByIdAndDelete(req.params.id).lean().then(deletedPost => {
            req.flash('success-message', `Post ${deletedPost.title} wurde gelöscht!`);
            res.redirect('/admin/posts');
        });
    },

    /* All Category Methods */
    /*getCategories: (req, res) => {
        Category.find().lean().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;
        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().lean().then(category => {
                res.status(200).json(category);
            });
        }
    },

    editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;
        const cats = await Category.find();

        Category.findById(catId).lean().then(cat => {
            res.render('admin/category/edit', {category: cat, categories: cats});
        });
    },

    editCategoriesPostRoute: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).lean().then(category => {
                category.title = newTitle;
                category.save().lean().then(updated => {
                    res.status(200).json({url: '/admin/category'});
                });
            });
        }
    }*/
};