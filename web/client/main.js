import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import './main.css';
import { Posts } from '../both/db';
import { Session } from 'meteor/session';
import _ from 'underscore';

GAnalytics.pageview();

Template.main.onCreated(() => {
    const template = Template.instance();
    template.autorun(() => {
        template.subscribe('posts');
    });
});
/*
Template.main.helpers({
    posts() {
        return Posts.find({}, {sort: {likes: -1}});
    },
});
*/
Template.main.helpers({
    posts() {
        var posts = Posts;
        //console.log(Posts.findOne({}))
        var keyword  = Session.get("search-query") ? Session.get("search-query") : null;
        if(keyword !== null){
            var query = new RegExp( keyword, 'i' );
            var results = posts.find( { $or: [{'donator': query},
                {'message': query}] } );
            console.log("Finding")
            if(results.count() !== 0){
                return results;
            }else{
                return [{donator:"Žádné výsledky."}];
            }
        }else {
            console.log("All")
            return posts.find({}, {sort: {likes: -1}});
        }
    },
});

const updateQuery = (evn) => {
    if(evn.currentTarget.value.length >= 3){
        Session.set("search-query", evt.currentTarget.value);
    }else{
        Session.set("search-query", null);
    }
};

const updateQueryDebounced = _.debounce(updateQuery, 500, false);

Template.main.events({
    'click .like'(event, instance) {
        event.preventDefault();
        // increment the counter when button is clicked
        const id = $(event.currentTarget).attr('id');
        console.log(id);
        Meteor.call('like', id, (data) => {
            console.log("ZEMAN: majby dan");
        });
    },
    'keyup input.search-query': function (evt) {
        updateQueryDebounced(evt)
    },
});
