const Article = require('../models/Article');
const User = require('../models/User');
const Reaction = require('../models/Reactions')
const Tag = require('../models/Tag');
const Comment = require('../models/Comments')
const { slugify } = require('../utils/stringUtil');
const sequelize = require('../dbConnection');
const { uuid } = require('uuidv4');
const { where, Sequelize } = require('sequelize');
const { serialize } = require('pg-protocol');
const ArticleReport = require('../models/articleReport');
const BlockUser = require('../models/BlockUser');
const Op = Sequelize.Op;
function sanitizeOutput(article, user) {
	const newTagList = [];
	for (let t of article.dataValues.Tags) {
		newTagList.push(t.name);
	}
	delete article.dataValues.Tags;
	article.dataValues.tagList = newTagList;

	if (article) {
		delete user.dataValues.password;
		delete user.dataValues.email;
		delete user.dataValues.following;
		article.dataValues.author = user;
		return article;
	}
}

function sanitizeOutputMultiple(article) {
	const newTagList = []; for (let t of article.dataValues.Tags) {
		newTagList.push(t.name);
	}
	delete article.dataValues.Tags;
	article.dataValues.tagList = newTagList;

	let user = {
		email: article.dataValues.User.email,
		intro_txt: article.dataValues.User.intro_txt,
		avatar_url: article.dataValues.User.avatar_url,
	};

	delete article.dataValues.User;
	article.dataValues.author = user;

	return article;
}

module.exports.createArticle = async (req, res) => {
	try {
		if (!req.body.article) throw new Error('No articles data');
		const data = req.body.article;
		if (!data.title) throw new Error('Article title is required');
		if (!data.body) throw new Error('Article body is required');

		//Find out author object
		const user = await User.findByPk(req.user.email);
		if (!user) throw new Error('User does not exist');
		const slug = uuid();

		let article = await Article.create({
			id: slug,
			create_at: Date.now(),
			title: data.title,
			content: data.body,
			permission: user.id,
			update_at: Date.now(),
			UserEmail: user.email,
		});
		if (data.tagList) {
			for (let t of data.tagList) {
				let tagExists = await Tag.findByPk(t);
				let newTag;
				if (!tagExists) {
					newTag = await Tag.create({ name: t });
					article.addTag(newTag);
				} else {
					article.addTag(tagExists);
				}
			}
		} // @todo Set tag for article


		article = await Article.findByPk(slug, { include: Tag });
		res.status(201).json({ article });
	} catch (e) {
		return res.status(422).json({
			errors: { body: ['Could not create article', e.message] },
		});
	}
};

module.exports.getDetailArticleById = async (req, res) => {
	try {
		const { id } = req.params;
		let article = await Article.findByPk(id, {
			include: [
				{
					model: Tag,
					attributes: ['name'],
				},
				{
					model: User,
					attributes: ['email', 'intro_txt', 'avatar_url'],
				},
			]
		});
		if (!article) {
			throw new Error("Article not found");
		}
		var user = await User.findByPk(article.UserEmail)
		article = sanitizeOutput(article, user); // @todo Set tag for article

		res.status(200).json({ article });
	} catch (e) {
		return res.status(422).json({
			errors: { body: ['Could not get article', e.message] },
		});
	}
};

module.exports.updateArticle = async (req, res) => {
	try {
		if (!req.body.article) throw new Error('No articles data');
		const data = req.body.article;
		const id = req.params.id;
		let article = await Article.findByPk(id, { include: Tag });

		if (!article) {
			res.status(404);
			throw new Error('Article not found');
		}
		const user = await User.findByPk(req.user.email);

		if (user.email != article.UserEmail) {
			res.status(403);
			throw new Error('You must be the author to modify this article');
		}

		const title = data.title ? data.title : article.title;
		const content = data.content ? data.content : article.content;

		const updatedArticle = await article.update({ id, title, content });

		article = sanitizeOutput(updatedArticle, user);
		res.status(200).json({ article });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Could not update article', e.message] },
		});
	}
};
module.exports.reportArticle = async (req, res) => {
	try {
		const content = req.body.content
		const data = req.body.id;
		let article = await Article.findByPk(data);

		if (!article) {
			res.status(404);
			throw new Error('Article not found');
		}

		const numberOfBlock = await ArticleReport.findAll({
			where:
			{
				UserEmail: req.user.email,
				ArticleId: data
			}
		})
		if (numberOfBlock.length > 3) {
			res.status(400).json({ message: "You have reached the maximum report of this article" })
			return;
		}
		const user = await User.findByPk(req.user.email)
		let Report = new ArticleReport;
		Report.ArticleId = data;
		Report.UserEmail = req.user.email;
		Report.content = content;
		await Report.save()
		Report = Report.dataValues;
		delete Report.UserEmail
		var userReport = {
			"avatar_url": user.avatar_url,
			"id": req.user.email,
			"first_name": user.first_name,
		}
		Report["userReport"] = userReport;
		res.status(200).json({ Report });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Could not Report article', e.message] },
		});
	}
};

module.exports.deleteArticle = async (req, res) => {
	try {
		const articId = req.params.articleId;
		console.log(articId)
		const userEmail = req.user.email;
		let article = await Article.findOne({
			where:{
				id: articId,
			}
		});

		if (!article) {
			res.status(404);
			throw new Error('Article not found');
		}

		const user = await User.findByPk(req.user.email);

		if (user.email != article.UserEmail) {
			res.status(403);
			throw new Error('You must be the author to modify this article');
		}

		await article.destroy();
		res.status(200).json({ message: 'Article deleted successfully' });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Could not delete article', e.message] },
		});
	}
};

module.exports.getAllArticles = async (req, res) => {
	try {
		//Get all articles:
		const { tag, author, limit = 20, offset = 0 } = req.query;
		let article;
		console.log(author, tag)
		if (!author && tag) {
			article = await Article.findAll({
				include: [
					// {
					// 	model: Tag,
					// 	attributes: ['name'],
					// 	where: { name: tag },
					// },
					{
						model: User,
						attributes: ['email', 'intro_txt', 'avatar_url'],
					},
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
			});
		} else if (author && !tag) {
			article = await Article.findAll({
				include: [
					// {
					// 	model: Tag,
					// 	attributes: ['name'],
					// },
					{
						model: User, attributes: ['email', 'intro_txt', 'avatar_url'], where: { email: author },
					},
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
			});
		} else if (author && tag) {
			article = await Article.findAll({
				include: [
					// {
					// 	model: Tag,
					// 	attributes: ['name'],
					// 	where: { name: tag },
					// },
					{
						model: User,
						attributes: ['email', 'intro_txt', 'avatar_url'],
						where: { email: author },
					}
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
			});
		} else {
			article = await Article.findAll({
				include: [
					// {
					// 	model: Tag,
					// 	attributes: ['name'],
					// },
					{
						model: User,
						attributes: ['email', 'intro_txt', 'avatar_url'],
					},
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
			});
		}
		// let articles = [];
		// for (let t of article) {
		// let addArt = sanitizeOutputMultiple(t);
		// 	articles.push(addArt);
		// }
		article.map((e) => e.dataValues)
		var articleData = []
		for (let i = 0; i < article.length; i++) {
			var comments = await Comment.findAll({
				where: {
					ArticleId: article[i].dataValues.id
				},
				include: [
					{
						model: User,
						attributes: ['email', 'intro_txt', 'avatar_url']
					}
				]
			})
			cmts = comments.map((e) => e.dataValues)
			loveQuery = `SELECT COUNT(react) as amount FROM Reactions WHERE Reactions.ArticleId = "${article[i].dataValues.id}" and Reactions.react = 1 GROUP BY react`;
			likeQuery = `SELECT COUNT(react) as amount FROM Reactions WHERE Reactions.ArticleId = "${article[i].dataValues.id}" and Reactions.react = 2 GROUP BY react`;
			hahaQuery = `SELECT COUNT(react) as amount FROM Reactions WHERE Reactions.ArticleId = "${article[i].dataValues.id}" and Reactions.react = 3 GROUP BY react`;
			var loveData = await sequelize.query(loveQuery)
			var hahaData = await sequelize.query(hahaQuery)
			var likeData = await sequelize.query(likeQuery)
			var loveJson = loveData[0].map((e) => e.amount)
			var likeQuery = await sequelize.query(likeQuery)
			var likeJson = likeData[0].map((e) => e.amount)
			var hahaQuery = await sequelize.query(hahaQuery)
			var hahaJson = hahaData[0].map((e) => e.amount)
			var reaction = {
				"love": loveJson[0],
				"like": likeJson[0],
				"haha": hahaJson[0]
			}

			var articleTmp = {
				"id": article[i].dataValues.id,
				"image": article[i].dataValues.image,
				"content": article[i].dataValues.content,
				"User": article[i].dataValues.User,
				"create_at": article[i].dataValues.create_at,
				"reactions": reaction,
				"comments": cmts
			}
			articleData.push(articleTmp)
		}

		res.json({ articleData });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Could not get article', e.message] },
		});

	};
}

module.exports.getArticleDetail = async (req, res) => {
	try {
		const articleId = req.params.articleId;
		const userEmail = req.params.userEmail;
		const block = await BlockUser.findOne({
			where: {
				[Op.or]: [
					{ user1_email: req.user.email, user2_email: userEmail },
					{ user1_email: userEmail, user2_email: req.user.email },
				]
			}
		})
		
		if (block) {
			res.status(401)
			throw new Error('Can not find this account')
		}
		
		
		let article = await Article.findOne({
			where: {
				id: articleId,
				UserEmail: userEmail
			},
			include: [
				{
					model: User, attributes: ['email', 'intro_txt', 'avatar_url'], where: { email: userEmail },
				},
			]
		});
		if (!article) {
			res.status(401)
			throw new Error('Can not find this article')
		}
		
		console.log(article);
		article = article.dataValues;
		var comments = await Comment.findAll({
			where: {
				ArticleId: article.id
			},
			include: [
				{
					model: User,
					attributes: ['email', 'intro_txt', 'avatar_url']
				}
			]
		})
		cmts = comments.map((e) => e.dataValues)
		loveQuery = `SELECT COUNT(react) as amount FROM Reactions WHERE Reactions.ArticleId = "${article.id}" and Reactions.react = 1 GROUP BY react`;
		likeQuery = `SELECT COUNT(react) as amount FROM Reactions WHERE Reactions.ArticleId = "${article.id}" and Reactions.react = 2 GROUP BY react`;
		hahaQuery = `SELECT COUNT(react) as amount FROM Reactions WHERE Reactions.ArticleId = "${article.id}" and Reactions.react = 3 GROUP BY react`;
		var loveData = await sequelize.query(loveQuery)
		var hahaData = await sequelize.query(hahaQuery)
		var likeData = await sequelize.query(likeQuery)
		var loveJson = loveData[0].map((e) => e.amount)
		var likeQuery = await sequelize.query(likeQuery)
		var likeJson = likeData[0].map((e) => e.amount)
		var hahaQuery = await sequelize.query(hahaQuery)
		var hahaJson = hahaData[0].map((e) => e.amount)
		var reaction = {
			"love": loveJson[0],
			"like": likeJson[0],
			"haha": hahaJson[0]
		}

		var articleTmp = {
			"id": article.id,
			"image": article.image,
			"content": article.content,
			"User": article.User,
			"create_at": article.create_at,
			"reactions": reaction,
			"comments": cmts
		}
		res.json({ articleTmp });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Could not get feed ', e.message] },
		});
	}
};

module.exports.searchArticle = async (req, res) => {
	try {
		const userEmail = req.user.email;
		let query = String(req.params.keyword);
		let filteredPosts = await Article.findAll();
		filteredPosts = filteredPosts.map(e => e.dataValues);
		if(!filteredPosts.length){
			res.status(404).json({message: "there is now article"})
		}
		query = query.toLowerCase();
		console.log(userEmail)
		if (query) {
		  filteredPosts = filteredPosts.filter(e =>
			e.title.toLowerCase().includes(query) ||
			e.UserEmail.toLowerCase().includes(query) ||
			e.content.toLowerCase().includes(query)
		  );
		}
		let block = await BlockUser.findAll({
            where: {
                [Op.or]: [
                    { user1_email: userEmail },
                    { user2_email: userEmail }
                ]
            }
        })
        let blockUser = [];
        if(block.length){
            for (let i = 0; i < block.length; i++) {
                if (block[i].user1_email == userEmail) blockUser.push(block[i].user2_email);
                else blockUser.push(block[i].user1_email);
            }
        }

		filteredPosts = filteredPosts.filter(e =>
			!blockUser.includes(e.UserEmail)
		  );
		console.log(query)
		res.json({ filteredPosts });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Could not get feed ', e.message] },
		});
	}
};