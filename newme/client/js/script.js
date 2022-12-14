((io, Whiteboard) => {
    window.addEventListener('load', () => {
        console.log('🌍 Connecting to server…');
        let colorval = ""
        const socket = io();
        const canvas = document.querySelector('#myCanvas');

        const pickr = new Pickr({
            el: '.color-picker',
            container: 'body',
            theme: 'classic',
            closeOnScroll: false,
            appClass: 'custom-class',
            useAsButton: false,
            padding: 8,
            inline: false,
            autoReposition: true,
            sliders: 'v',
            disabled: false,
            lockOpacity: false,
            outputPrecision: 0,
            comparison: true,
            default: '#42445a',
            swatches: null,
            defaultRepresentation: 'HEX',
            showAlways: false,
            closeWithKey: 'Escape',
            position: 'bottom-middle',
            adjustableNumbers: true,
        
            // Show or hide specific components.
            // By default only the palette (and the save button) is visible.
            // components: {
        
            //     // Defines if the palette itself should be visible.
            //     // Will be overwritten with true if preview, opacity or hue are true
            //     palette: true,
        
            //     preview: true, // Display comparison between previous state and new color
            //     opacity: true, // Display opacity slider
            //     hue: true,     // Display hue slider
        
            //     // show or hide components on the bottom interaction bar.
            //     interaction: {
        
            //         // Buttons, if you disable one but use the format in default: or setColor() - set the representation-type too!
            //         hex: false,  // Display 'input/output format as hex' button  (hexadecimal representation of the rgba value)
            //         rgba: false, // Display 'input/output format as rgba' button (red green blue and alpha)
            //         hsla: false, // Display 'input/output format as hsla' button (hue saturation lightness and alpha)
            //         hsva: false, // Display 'input/output format as hsva' button (hue saturation value and alpha)
            //         cmyk: false, // Display 'input/output format as cmyk' button (cyan mangenta yellow key )
        
            //         input: false, // Display input/output textbox which shows the selected color value.
            //                      // the format of the input is determined by defaultRepresentation,
            //                      // and can be changed by the user with the buttons set by hex, rgba, hsla, etc (above).
            //         cancel: false, // Display Cancel Button, resets the color to the previous state
            //         clear: false, // Display Clear Button; same as cancel, but keeps the window open
            //         save: false,  // Display Save Button,
            //     },
            // },
            components: {

                // Main components
                preview: true,
                opacity: true,
                hue: true,
        
                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    cmyk: true,
                    input: true,
                    clear: true,
                    save: true
                }
            },
        
            // Translations, these are the default values.
            i18n: {
        
                // Strings visible in the UI
               'ui:dialog': 'color picker dialog',
               'btn:toggle': 'toggle color picker dialog',
               'btn:swatch': 'color swatch',
               'btn:last-color': 'use previous color',
               'btn:save': 'Save',
               'btn:cancel': 'Cancel',
               'btn:clear': 'Clear',
        
               // Strings used for aria-labels
               'aria:btn:save': 'save and close',
               'aria:btn:cancel': 'cancel and close',
               'aria:btn:clear': 'clear and close',
               'aria:input': 'color input field',
               'aria:palette': 'color selection area',
               'aria:hue': 'hue selection slider',
               'aria:opacity': 'selection slider'
            }
        });
        // console.log("hello")
        socket.on('datalist',function(ee){
            localStorage.setItem('storage',JSON.stringify(ee))
        })
        socket.on('connect', (e) => {
            // At this point we have connected to the server
            console.log('🌍 Connected to server');

            // Create a Whiteboard instance
            const whiteboard = new Whiteboard(canvas, socket);

            // Expose the whiteboard instance
            pickr.on('save', function(color, e){
                colorval = color.toHEXA().toString()
                whiteboard.color = colorval
                socket.emit('CHANGE_COLOR',{color:'blue'})
            })
            window.whiteboard = whiteboard;
        });

    });
})(io, Whiteboard);
