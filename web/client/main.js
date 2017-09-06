import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import { Posts } from '../both/db';

Template.hello.onCreated(() => {
    const template = Template.instance();
    template.autorun(() => {
        template.subscribe('posts');
    });
});

Template.hello.helpers({
  posts() {
    return Posts.find({});
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
