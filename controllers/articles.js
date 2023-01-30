const Article = require('../models/Article');
const User = require('../models/User');
const Tag = require('../models/Tag');
const { slugify } = require('../utils/stringUtil');
const sequelize = require('../dbConnection');
const { uuid } = require('uuidv4');

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
		article = sanitizeOutput(article, user);  // @todo Set tag for article
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

module.exports.deleteArticle = async (req, res) => {
	try {
		const slugInfo = req.params.slug;
		let article = await Article.findByPk(slugInfo, { include: Tag });

		if (!article) {
			res.status(404);
			throw new Error('Article not found');
		}

		const user = await User.findByPk(req.user.email);

		if (user.email != article.UserEmail) {
			res.status(403);
			throw new Error('You must be the author to modify this article');
		}

		await Article.destroy({ where: { slug: slugInfo } });
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
			console.log(article)
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
					},
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
		res.json({ article });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Could not get article', e.message] },
		});

	};
}

module.exports.getFeed = async (req, res) => {
	try {
		const query = `
            SELECT UserEmail
            FROM followers
            WHERE followerEmail = "${req.user.email}"`;
		const followingUsers = await sequelize.query(query);
		if (followingUsers[0].length == 0) {
			return res.json({ articles: [] });
		}
		let followingUserEmail = [];
		for (let t of followingUsers[0]) {
			followingUserEmail.push(t.UserEmail);
		}

		let article = await Article.findAll({
			where: {
				UserEmail: followingUserEmail,
			},
			include: [Tag, User],
		});

		let articles = [];
		for (let t of article) {
			let addArt = sanitizeOutputMultiple(t);
			articles.push(addArt);
		}

		res.json({ articles });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Could not get feed ', e.message] },
		});
	}
};