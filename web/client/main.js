import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import './main.css';
import { Posts } from '../both/db';

GAnalytics.pageview();
const PAGE_LIMIT = 100;

Template.main.onCreated(() => {
    const template = Template.instance();
    template.postLimit = new ReactiveVar(PAGE_LIMIT);
    template.loading = new ReactiveVar(true);
    template.postsCount = new ReactiveVar();

    Meteor.call('postsCount', (count)=> {
        template.postsCount.set(count);
    });

    // Infinite scroll
    $(window).scroll(function () {
        const target = $("#last-element");
        if (!target.length) return;
        const rect = target[0].getBoundingClientRect();
        if (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */) {
            template.loading.set(true);
            template.postLimit.set(PAGE_LIMIT + template.postLimit.get());
        }
    });

    template.autorun(() => {
        template.subscribe('posts', template.postLimit.get(), () => {
            if (template.postsCount.get() && template.postLimit.get() >= template.postsCount.get()) return;
            template.loading.set(false);
        });
    });
});

Template.main.helpers({
    posts() {
        return Posts.find({}, {sort: {likes: -1}, limit: Template.instance().postLimit.get() });
    },
    loading() {
        return Template.instance().loading.get();
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
