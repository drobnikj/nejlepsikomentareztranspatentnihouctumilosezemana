import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import './main.css';
import { Posts } from '../both/db';

GAnalytics.pageview();

Template.main.onCreated(() => {
    const template = Template.instance();
    template.autorun(() => {
        template.subscribe('posts');
    });
});

Template.main.helpers({
    posts() {
        return Posts.find({}, {sort: {likes: -1}});
    },
});

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
});
