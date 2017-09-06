import { Meteor } from 'meteor/meteor';
import ApifyClient from 'apify-client';
import { Posts } from '../both/db';



Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('posts', () => {
    return Posts.find({});
});

const importPosts = (_id) => {
    const apifyCient = new ApifyClient({});
    const crawlerExecution = Meteor.wrapAsync(apifyCient.crawlers.getExecutionDetails)({ executionId: _id} );

    if (crawlerExecution.actId !== 'n7ohHth6eBsiHJhtD') {
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
    console.log(_id);
    Meteor.setTimeout(() => importPosts(_id), 0);
    JsonRoutes.sendResult(res, {
        state: 'ZEMAN: Mejby importet ;)',
    });
});
