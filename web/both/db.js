export const Posts = new Mongo.Collection('posts');

Posts._ensureIndex({ "uniqueKey": 1, "likes": -1 });
Posts._ensureIndex({ "likesBy.ip": 1, "likeslikesBy.date": 1 });


