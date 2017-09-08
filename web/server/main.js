import { Meteor } from 'meteor/meteor';
import ApifyClient from 'apify-client';
import { Posts } from '../both/db';
import '../both/db';



Meteor.startup(() => {
    // code to run on server at startup
    Posts._ensureIndex({ "uniqueKey": 1, "likes": -1 });
    Posts._ensureIndex({ "likesBy.ip": 1, "likesBy.date": 1 });
});

Meteor.publish('posts', () => {
    return Posts.find({}, {sort: {likes: -1}});
});

Meteor.methods({
    'like'(uniqueKey) {
        console.log("like "+uniqueKey);
        const ip = this.connection.clientAddress;
        console.log(new Date(new Date() - 24*60*60*1000));
        const lastLikes = Posts.find({ uniqueKey, "likesBy.ip": ip, "likesBy.date": { $gte: new Date(new Date() - 24*60*60*1000)} } );
        if (lastLikes.count()) {
            console.log("kundo!");
            return 'kundo';
        }
        return Posts.update({ uniqueKey }, {
            $inc: { likes: 1 },
            $push: { likesBy: {
                ip: ip,
                date: new Date(),
            } }

        });
    }
});

const importPosts = (_id) => {
    const apifyCient = new ApifyClient({});
    const crawlerExecution = Meteor.wrapAsync(apifyCient.crawlers.getExecutionDetails)({ executionId: _id} );

    if (crawlerExecution.actId !== Meteor.settings.actId) {
        console.log(`ZEMAN: Bet kravler ajdy ${crawlerExecution.actId} :(`);
        return;
    }

    const results = Meteor.wrapAsync(apifyCient.crawlers.getExecutionResults)({ executionId: _id, simplified: 1 });
    results.items.forEach((item) => {
        const existing = Posts.findOne({ uniqueKey: item.uniqueKey });
        if (!existing) {
            Posts.insert(item);
        }
    });
};

JsonRoutes.add("post", "/import", function (req, res, next) {
    const _id = req.body._id;
    if (!_id) return 'Kundo';
    Meteor.setTimeout(() => importPosts(_id), 0);
    JsonRoutes.sendResult(res, {
        state: 'ZEMAN: Mejby importet ;)',
    });
});
