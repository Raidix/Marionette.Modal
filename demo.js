/* global Mn, _ */
var modal = new Mn.Modal;

var baseTemplate = _.template(
    '<i class="icon icon-lg icon-times icon_close js-reject"></i>' +
    '<div class="demo-content"><%=content%></div>' +
    '<button class="button js-reject">Reject</button>'
);

var content = '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod' +
    'tempor incididunt ut labore et dolore magna aliqua.</p> <p>Ut enim ad minim veniam,' +
    'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse' +
    'cillum dolore eu fugiat nulla pariatur.</p> <p>Excepteur sint occaecat cupidatat non' +
    'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';

var BaseView = Mn.ItemView.extend({
    template: baseTemplate,

    serializeData: function () {
        return { content: content };
    }
});

var dialogData = {
    slideTop: {
        View: BaseView,
        effect: 'slideTop',
        isActive: true
    },

    fade: {
        View: BaseView,
        effect: 'fade',
        isActive: true
    }
};

var onTestClick = function () {
    var name = this.getAttribute('data-name');

    modal.add(dialogData[name]);
};

document.addEventListener('DOMContentLoaded', function () {
    // initialize test links
    var testLinks = document.querySelectorAll('.js-test');

    Array.prototype.forEach.call(testLinks, function (link) {
        link.addEventListener('click', onTestClick);
    });
});