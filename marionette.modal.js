(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore', 'marionette'], factory);
    }
    else {
        root.Marionette.Modal = factory(root.Backbone, root._, root.Marionette);
    }
}(this, function (Backbone, _, Marionette) {
    'use strict';

    // default model
    var ModalModel = Backbone.Model.extend({
        defaults: {
            isActive: false
        },

        isNew: function () {
            return true;
        }
    });

    // control collection
    var ModalCollection = Backbone.Collection.extend({
        model: ModalModel,

        initialize: function () {
            this.on('destroy', this.onDestroy);
        },

        getActive: function () {
            return this.findWhere({ isActive: true });
        },

        hasActive: function () {
            return this.some(function (model) {
                return model.get('isActive');
            });
        },

        getGroup: function (model) {
            var group = model.get('group');

            if (group !== void 0) {
                return this.where({ group: group });
            }

            return [];
        },

        onDestroy: function (model) {
            var models = this.getGroup(model);

            if (models.length > 0) {
                this.remove(models);
            }

            this.reactivate();
        },

        reactivate: function () {
            var model = this.last();

            if (model !== void 0) {
                model.set('isActive', true);
            }
        }
    });

    // overlay
    var OverlayView = Marionette.ItemView.extend({
        template: false,

        el: '#modal-overlay',

        events: {
            'click': 'onClick'
        },

        toggle: function (state) {
            if (state) {
                return this.$el.fadeIn(200);
            }

            return this.$el.fadeOut(200);
        },

        onClick: function () {
            this.trigger('click');
        }
    });

    // modal
    var ModalView = Marionette.LayoutView.extend({
        template: _.template('<div class="modal-content-region"></div>'),

        events: {
            'click .js-submit:not(.js-disabled)': 'onSubmit',
            'click .js-reject': 'onReject',
            'click .js-next': 'onNext',
            'click .js-previous': 'onPrevious'
        },

        className: function () {
            var _className = 'modal';
            var className = this.model.get('className');

            if (_.isString(className)) {
                _className += ' ' + className;
            }

            return _className;
        },

        modelEvents: {
            'change:isActive': 'onChangeActive',
            'reject': 'onReject',
            'submit': 'onSubmit'
        },

        regions: {
            contentRegion: '.modal-content-region'
        },

        onRender: function () {
            var View = this.model.get('View');

            this.contentRegion.show(new View);
            this.toggle(this.model.get('isActive'));
        },

        toggle: function (state) {
            var self = this;
            var offset = Backbone.$(window).scrollTop();

            if (state) {
                this.$el.show()
                    .css({ top: offset + 'px', opacity: 0 })
                    .animate({ top: offset + 100 + 'px', opacity: 1 }, 200, 'linear');
            }
            else {
                this.$el.animate({ top: offset + 'px', opacity: 0 }, 200, 'linear', function () {
                    self.$el.hide();
                });
            }
        },

        onChangeActive: function (model, value) {
            this.toggle(value);
        },

        onSubmit: function (event) {
            var target = event.currentTarget;

            var self = this;
            var submitStatus = this.contentRegion.currentView.triggerMethod('submit');

            // prevent closing if onSubmit method of child view returns "false"
            if (submitStatus === false) {
                return;
            }

            target.classList.add('disabled', 'js-disabled');

            Backbone.$.when(submitStatus)
                .done(function () {
                    self.closeModal();
                })
                .fail(function () {
                    target.classList.remove('disabled', 'js-disabled');
                });
        },

        onReject: function () {
            var cancelStatus = this.contentRegion.currentView.triggerMethod('reject');

            // prevent closing if onReject method of child view returns "false"
            if (cancelStatus === false) {
                return;
            }

            this.closeModal();
        },

        onNext: function () {
            var modalId = this.contentRegion.currentView.triggerMethod('next');

            this._toggleModal(modalId);
        },

        onPrevious: function () {
            var modalId = this.contentRegion.currentView.triggerMethod('previous');

            this._toggleModal(modalId);
        },

        _toggleModal: function (modalId) {
            // prevent switching modals if methods of child view returns "false"
            if (modalId === false) {
                return;
            }

            var targetModal = this.model.collection.get(modalId);

            if (targetModal === void 0) {
                throw new Marionette.Error({
                    message: 'modal dialog with id "' + modalId + '" not found',
                    name: 'ModalException'
                });
            }

            this.model.set('isActive', false);
            targetModal.set('isActive', true);
        },

        closeModal: function () {
            var self = this;
            var offset = Backbone.$(window).scrollTop();

            this.$el.animate({ top: offset + 'px', opacity: 0 }, 200, 'linear', function () {
                self.model.destroy();
            });
        }
    });

    // modal container
    var ModalContainer = Marionette.CollectionView.extend({
        el: '#modal-container',
        sort: false,
        childView: ModalView
    });

    // constructor
    var ModalController = function () {
        this._settings = {};

        // initialize overlay once
        this.overlay = (new OverlayView).render();

        this.collection = new ModalCollection;

        this.container = new ModalContainer({
            collection: this.collection
        });

        this.container.render();

        this.listenTo(this.overlay, 'click', this.onReject);
        this.listenTo(this.container, 'add:child remove:child', this.toggleOverlay);
    };

    // controller methods
    _.extend(ModalController.prototype, Backbone.Events, {
        add: function (item) {
            if (item.isActive) {
                this.collection.invoke('set', 'isActive', false);
            }
            else if (this.collection.length === 0) {
                item.isActive = true;
            }

            this.collection.add(item);
        },

        onReject: function () {
            var activeModal = this.collection.getActive();

            if (activeModal !== void 0) {
                activeModal.trigger('reject');
            }
        },

        onSubmit: function () {
            var activeModal = this.collection.getActive();

            if (activeModal !== void 0) {
                activeModal.trigger('submit');
            }
        },

        toggleOverlay: function () {
            this.overlay.toggle(this.collection.length > 0);
        },

        configure: function (settings) {
            if (settings.EA) {
                this._resetEvents(settings.EA);
            }
        },

        _resetEvents: function (EA) {
            if (this._settings.EA) {
                this.stopListening(this._settings.EA);
            }

            this._settings.EA = EA;

            this.listenTo(EA, 'submit', this.onSubmit);
            this.listenTo(EA, 'reject', this.onReject);
        }
    });

    return new ModalController;
}));
