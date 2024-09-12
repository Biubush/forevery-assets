document.addEventListener('DOMContentLoaded', function () {

    const colorPicker = Pickr.create({
        el: '#colorPicker',
        theme: 'classic',
        default: '#000000',

        swatches: [
            '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'
        ],

        components: {
            // Main components
            preview: true,
            opacity: true,
            hue: true,

            // Input / output Options
            interaction: {
                cancel: true,
                save: true,
            }
        }
    });

    colorPicker.on('change', (color) => {
        const colorValue = color.toRGBA().toString();
        if (selectedTextBox) {
            selectedTextBox.style.color = colorValue;
        }
    });
    
});