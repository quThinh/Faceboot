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
// const Relationship = require('./models/Relationship')
const MyCoordinate = require('./models/MyCoordinates')
const Reactions = require('./models/Reactions')
const RecommendFriend = require('./models/RecommendFriend')
const FriendRequest = require('./models/FriendRequest')
const Friend = require('./models/Friend')
const SearchRecent = require('./models/SearchRecent')
const WatchVideo = require('./models/WatchVideo')
const Video = require('./models/Video')
const BackgroundColor = require('./models/BackgroundColor')
const PhotoInPost = require('./models/PhotoInPost')
const PostReport = require('./models/PostReport')
const Chat = require('./models/Chat')
const Message = require('./models/Message')
const Notification = require('./models/Notification')
const userRoute = require('./routes/users')
const friendRoute = require('./routes/friends')
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
//1 to many relation between user and notification
User.hasMany(Notification,{
    onDelete: 'CASCADE'
})
Notification.belongsTo(User)
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
// //1 to many relation between Article and photo
// User.hasOne(PhotoInPost,{
//     onDelete: 'CASCADE'
// })
// PhotoInPost.belongsTo(User)
//1 to many relation between User and Comments
User.hasMany(Comment,{onDelete: 'CASCADE'})
Comment.belongsTo(User)
//many to many relationship between user and user => create table friendRecommend
User.belongsToMany(User, {
    through: 'FriendRecommend',
    as: 'recommend_user1',
    foreignKey: 'user1_id',
    otherKey: 'user2_id'
  });
  
  User.belongsToMany(User, {
    through: 'FriendRecommend',
    as: 'recommend_user2',
    foreignKey: 'user2_id',
    otherKey: 'user1_id'
  });

//many to many relationship between user and user => create table friendRequest
User.belongsToMany(User, {
    through: 'FriendRequest',
    as: 'send_user',
    foreignKey: 'send_user_email',
    otherKey: 'receive_user_email'
  });
  
  User.belongsToMany(User, {
    through: 'FriendRequest',
    as: 'receive_user',
    foreignKey: 'receive_user_email',
    otherKey: 'send_user_email'
  });

//1 to many relation between User and SearchRecent
User.hasMany(SearchRecent,{onDelete: 'CASCADE'})
SearchRecent.belongsTo(User)

//1 to many relation between User and PostReport
User.hasOne(PostReport,{onDelete: 'CASCADE'})
PostReport.belongsTo(User)

//RELATIONS POST:
//1 to 1 relation between Article and Reaction
Article.hasOne(Reactions,{
    onDelete: 'CASCADE'
})
Reactions.belongsTo(Article)
//1 to 1 relation between Article and PostReport
Article.hasOne(PostReport,{
    onDelete: 'CASCADE'
})
PostReport.belongsTo(Article)
//1 to many relation between article and comment
Article.hasMany(Comment,{
    onDelete: 'CASCADE'
})
//1 to many relation between article and noti
Article.hasMany(Notification,{
    onDelete: 'CASCADE'
})
Notification.belongsTo(Article)
//1 to many relation between article and photo
Article.hasMany(PhotoInPost,{
    onDelete: 'CASCADE'
})
PhotoInPost.belongsTo(Article)

//RELATIONS WatchVideo:
//1 to 1 relation between WatchVideo and Video
WatchVideo.hasOne(Video,{
    onDelete: 'CASCADE'
})
Video.belongsTo(WatchVideo)
//1 to 1 relation between WatchVideo and Reaction
WatchVideo.hasOne(Reactions,{
    onDelete: 'CASCADE'
})
Reactions.belongsTo(WatchVideo)
//1 to many relation between WatchVideo and comment
WatchVideo.hasMany(Comment,{
    onDelete: 'CASCADE'
})
Comment.belongsTo(WatchVideo)


//many to many relation between Message and User
User.belongsToMany(User, {
    through: 'Message',
    as: 'sender_message_id',
    foreignKey: 'sender_id',
    otherKey: 'receiver_id'
  });
  
  User.belongsToMany(User, {
    through: 'Message',
    as: 'receiver_message_id',
    foreignKey: 'receiver_id',
  otherKey: 'sender_id'
  });
//many to many Friend relation between user and User
User.belongsToMany(User, {
    through: 'Friend',
    as: 'emailFriend1',
    foreignKey: 'user1_email',
    otherKey: 'user2_email'
  });
  
  User.belongsToMany(User, {
    through: 'Friend',
    as: 'emailFriend2',
    foreignKey: 'user2_email',
    otherKey: 'user1_email'
  });
//1 to many relation between Chat and Message
Chat.hasMany(Message,{
    onDelete: 'CASCADE'
})
Message.belongsTo(Chat)
Article.hasMany(Tag)
Tag.belongsTo(Article, {
  as: 'article_id',
  foreignKey: 'id',
})
//1 to many relation between Chat and Member
// User.belongsToMany(User, {
//     through: 'Chat',
//     as: 'sender_message_id',
//     foreignKey: 'sender_id',
//     otherKey: 'receiver_id'
//   });
  
//   User.belongsToMany(User, {
//     through: 'Chat',
//     as: 'receiver_message_id',
//     foreignKey: 'receiver_id',
//     otherKey: 'sender_id'
//   });
// Chat.hasMany(User,{
//     onDelete: 'CASCADE'
// })
// User.belongsTo(Chat)
//1 to many relation between Chat and blocker
// Chat.hasMany(User,{
//     onDelete: 'CASCADE'
// })
// User.belongsTo(Chat)





const sync = async () => await sequelize.sync({alter:true})
sync()

app.use(express.json())
app.use(morgan('tiny'))

app.get('/',(req,res) => {
    res.json({status:"API is running"});
})
app.use('/',userRoute)
app.use('/',friendRoute)
app.use('/',articleRoute)
app.use('/api/articles',commentRoute)
app.use('/api/tags',tagRoute)
app.use('/api/profiles',profileRoute)
app.use('/api/articles',favouriteRoute)
app.use(notFound)
app.use(errorHandler)

//user route
app.use('/api/articles',favouriteRoute)

const PORT = process.env.PORT || 8080

app.listen(PORT,() => {
    console.log(`Server running on http://localhost:8080`);
})