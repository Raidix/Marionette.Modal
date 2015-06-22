# Marionette.Modal [![Build Status](https://travis-ci.org/Raidix/Marionette.Modal.svg?branch=master)](https://travis-ci.org/Raidix/Marionette.Modal)

## Supported browsers
* IE 10+ ([with classList polyfill](polyfill.classlist.min.js))
* Chrome 31+
* Firefox 31+

## Example

### Minimal required markup
```html
<div id="mn-modal" class="mn-modal"></div>
```
### Code sample

```javascript
define(['backbone.marionette', 'marionette.modal'], function (Marionette, Modal) {
    // this is view will rendered inside modal dialog
    var ChildView = Marionette.ItemView.extend({
        template: '#awsum-template',

        onSubmit: function () {
            // do submit stuff ...
        },

        onReject: function () {
            // do reject stuff ...
        }
    });

    // Wow, modal!
    Modal.add({ View: ChildView });
});
```
