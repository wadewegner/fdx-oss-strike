({
    setHeight: function(component, event, helper) {
        var height = component.get('v.height');
        var size = component.get('v.size');

        if (size == 'small') {
            component.set('v.height', '56px');
        } else if (size == 'medium') {
            component.set('v.height', '72px');
        } else if (size == 'large') {
            component.set('v.height', '210px');
        } else {
            component.set('v.height', height);
        }
    }
})