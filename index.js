const dotenv = require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const {notFound,errorHandler} = require('./middleware/errorHandler')
const sequelize = require('./dbConnection')

const User = require('./models/User')
const Article = require('./models/Article')
const Tag = require('./models/Tag')
const Comment = require('./models/Comments')
const Relationship = require('./models/Relationship')
const MyCoordinate = require('./models/MyCoordinates')
const Reactions = require('./models/Reactions')
const RecommendFriend = require('./models/RecommendFriend')
const FriendRequest = require('./models/FriendRequest')
const SearchRecent = require('./models/SearchRecent')

const userRoute = require('./routes/users')
const articleRoute = require('./routes/articles')
const commentRoute = require('./routes/comments')
const tagRoute = require('./routes/tags')
const profileRoute = require('./routes/profile')
const favouriteRoute = require('./routes/favourites')
const { post } = require('./routes/users')

const app = express()

//CORS
app.use(cors({credentials: true, origin: true})) 



//RELATIONS USER:
//1 to many relation between user and article
User.hasMany(Article,{
    onDelete: 'CASCADE'
})
Article.belongsTo(User)
//many to many relation between user and user => create table Friend

User.belongsToMany(User, {
    through: 'Relationship',
    as: 'user1',
    foreignKey: 'user1_id',
    otherKey: 'user2_id'
  });
  
  User.belongsToMany(User, {
    through: 'Relationship',
    as: 'user2',
    foreignKey: 'user2_id',
    otherKey: 'user1_id'
  });

//1 to 1 relation between user and coordinate
User.hasOne(MyCoordinate,{
    onDelete: 'CASCADE'
})
MyCoordinate.belongsTo(User)
//1 to many relation between User and Comments
User.hasMany(Comment,{onDelete: 'CASCADE'})
Comment.belongsTo(User)
//1 to many relation between User and Recommend Friend
User.hasMany(RecommendFriend,{onDelete: 'CASCADE'})
RecommendFriend.belongsTo(User)
//1 to many relation between User and FriendRequest
User.hasMany(FriendRequest,{onDelete: 'CASCADE'})
FriendRequest.belongsTo(User)
//1 to many relation between User and SearchRecent
User.hasMany(SearchRecent,{onDelete: 'CASCADE'})
SearchRecent.belongsTo(User)

//RELATIONS POST:
//1 to 1 relation between Article and Reaction
Article.hasOne(Reactions,{
    onDelete: 'CASCADE'
})
Reactions.belongsTo(Article)
//1 to many relation between article and comment
Article.hasMany(Comment,{
    onDelete: 'CASCADE'
})
Comment.belongsTo(Article)




//many to many relation between article and taglist
// Article.belongsToMany(Tag,{through: 'TagList',uniqueKey:false,timestamps:false})
// Tag.belongsToMany(Article,{through: 'TagList',uniqueKey:false,timestamps:false})

//One to many relation between Article and Comments
// Article.hasMany(Comment,{onDelete: 'CASCADE'})
// Comment.belongsTo(Article)

// //One to many relation between User and Comments
// User.hasMany(Comment,{onDelete: 'CASCADE'})
// Comment.belongsTo(User)

//Many to many relation between User and User
// User.belongsToMany(User,{
//     through:'Followers',
//     as:'followers',
//     timestamps:false,
// })

//favourite Many to many relation between User and article
// User.belongsToMany(Article,{through: 'Favourites',timestamps:false})
// Article.belongsToMany(User,{through: 'Favourites',timestamps:false})



const sync = async () => await sequelize.sync({alter:true})
sync()

app.use(express.json())
app.use(morgan('tiny'))

app.get('/',(req,res) => {
    res.json({status:"API is running"});
})
app.use('/api',userRoute)
app.use('/api/articles',articleRoute)
app.use('/api/articles',commentRoute)
app.use('/api/tags',tagRoute)
app.use('/api/profiles',profileRoute)
app.use('/api/articles',favouriteRoute)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(PORT,() => {
    console.log(`Server running on http://localhost:8080`);
})