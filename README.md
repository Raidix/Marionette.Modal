# Marionette.Modal

## Example

### HTML
```html
<body>

<!-- so much html here -->

<!-- required markup -->
<div id="modal-container">
    <div id="modal-overlay" class="modal-overlay"></div>
</div>

</body>
```

### JavaScript
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
