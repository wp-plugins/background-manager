/*
 * Copyright (c) 2011-2012 Mike Green <myatus@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */
(function($){
    $.extend(myatu_bgm, {
        /** Shows additional layouts if 'Fullscreen' is not selected, hides otherwise. */
        showHideLayoutTable: function(e) {
            var is_full = ($('input[name="background_size"]:checked').val() == 'full');

            if (is_full) {
                $('.bg_extra_layout').hide();
                $('.bg_fs_layout').show('slow');
                myatu_bgm.updateOpacity();
            } else {
                $('.bg_fs_layout').hide();
                $('.bg_extra_layout').show('slow');
                myatu_bgm.updateOpacity(100); // Opacity is not available for 'Normal' displaying
            }

            // Determine if we can show Background Transition settings
            myatu_bgm.showHideBackgroundTransition();
        },

        /** Hides or shows additional settings for Background Information */
        showHideInfoExtra: function() {
            if ($('#info_tab:checked').length) {
                $('.info_tab_extra').show('slow');
            } else {
                $('.info_tab_extra').hide('slow');
            }
        },

        /** Hides or shows the Background Transition settings */
        showHideBackgroundTransition: function() {
            var is_full = ($('input[name="background_size"]:checked').val() == 'full'),
                is_custom_freq = ($('input[name="change_freq"]:checked').val() == 'custom');

            if (is_full && is_custom_freq) {
                $('.bg_transition').show('slow');
            } else {
                $('.bg_transition').hide('slow');
            }
        },

        /** Changes the preview background color according to the selection */
        updatePreviewColor: function() {
            var color = $('#background_color').val();

            if (color && color.charAt(0) == '#') {
                if (color.length > 1) {
                    $('#bg_preview_bg_color').css('background-color', color);
                    $('#clear_color').show();
                } else {
                    $('#bg_preview_bg_color').css('background-color', '');
                    $('#clear_color').hide();
                }
            }
        },

        /** Changes the opacity of the preview */
        updateOpacity : function(force_to) {
            var opacity = $('#background_opacity').val(), str_opacity = '100';

            if (force_to)
                opacity = force_to;

            if (opacity < 10) {
                str_opacity = '.0' + opacity;
            } else  if (opacity < 100) {
                str_opacity = '.' + opacity;
            }

            $('#bg_preview').css('opacity', str_opacity);
        },


        /** Updates the overlay preview */
        updatePreviewOverlay: function() {
            var data = myatu_bgm.GetAjaxData('overlay_data', $('#active_overlay option:selected').val());

            if (data) {
                $('#bg_preview_overlay').css('background', 'url(\'' + data + '\') repeat fixed top left transparent');
            } else {
                $('#bg_preview_overlay').css('background', '');
            }
        },

        /** Updates the image used in the preview, taken from the selected gallery */
        updatePreviewGallery: function() {
            var id = $('#active_gallery option:selected').val(), img = myatu_bgm.GetAjaxData('random_image', {'active_gallery': id, 'prev_img': 'none'});

            if (img) {
                $('#bg_preview').css('background-image', 'url(\'' + img.thumb + '\')');
            } else {
                $('#bg_preview').css('background-image', '');
            }
        },

        /** Updates the preview layout according to the selected settings, ie., tiled, full screen */
        updatePreviewLayout: function() {
            var screen_size = $('input[name="background_size"]:checked').val(),
                position    = $('input[name="background_position"]:checked').val().replace('-', ' '),
                repeat      = $('input[name="background_repeat"]:checked').val(),
                stretch_h   = ($('#background_stretch_horizontal:checked').length == 1),
                stretch_v   = ($('#background_stretch_vertical:checked').length == 1);

            if (screen_size == 'full') {
                // If full-screen, we emulate the result
                $('#bg_preview').css({
                    'background-size': '100% auto',
                    'background-repeat': 'no-repeat',
                    'background-position': '50% 50%',
                });
            } else {
                // The thumbnail is further resized to 50x50px
                $('#bg_preview').css({
                    'background-size': ((stretch_h) ? '100%' : '50px') + ' ' + ((stretch_v) ? '100%' : '50px'),
                    'background-repeat': repeat,
                    'background-position': position,
                });            
            }
        },

        /** Resets the color field */
        clearColor: function() {
            $('#background_color').val('#');
            myatu_bgm.updatePreviewColor();

            return false;
        }
    });

    $(document).ready(function($){
        // Pre-set values
        myatu_bgm.updatePreviewColor();
        myatu_bgm.updatePreviewGallery();
        myatu_bgm.updateOpacity();
        myatu_bgm.updatePreviewLayout();
        myatu_bgm.updatePreviewOverlay();

        myatu_bgm.showHideInfoExtra();
        myatu_bgm.showHideLayoutTable();

        // Background Color field
        $('#background_color').focusin(function() { 
            $('#color_picker').show(); 
        }).focusout(function() { 
            $('#color_picker').hide(); 
            myatu_bgm.updatePreviewColor();
        }).keyup(function () { 
            if (this.value.charAt(0) != '#') this.value = '#' + this.value; 
            $.farbtastic('#color_picker').setColor($('#background_color').val()); 
            myatu_bgm.updatePreviewColor();
        });

        // Color picker
        $('#color_picker').farbtastic(function(color) { 
            $('#background_color').attr('value', color);
            myatu_bgm.updatePreviewColor();
        });
        $.farbtastic('#color_picker').setColor($('#background_color').val());

        // Opacity picker
	    $('#opacity_picker').slider({
		    value: $('#background_opacity').val(),
		    min: 1,
		    max: 100,
		    slide: function(event, ui) {
			    $("#background_opacity").val(ui.value);
                $("#opacity_picker_val").text(ui.value + '%');
                myatu_bgm.updateOpacity();
		    }
	    });

        // Transition Speed picker
	    $('#transition_speed_picker').slider({
		    value: $('#transition_speed').val(),
		    min: 100,
		    max: 7500,
            step: 100,
		    slide: function(event, ui) {
			    $("#transition_speed").val(ui.value);
                myatu_bgm.updateOpacity();
		    }
	    });

        // Set events
        $('input[name="background_size"]').change(myatu_bgm.showHideLayoutTable);
        $('#active_gallery').change(myatu_bgm.updatePreviewGallery);
        $('#active_overlay').change(myatu_bgm.updatePreviewOverlay);
        $('input[name="background_size"]').change(myatu_bgm.updatePreviewLayout);
        $('input[name="background_position"]').change(myatu_bgm.updatePreviewLayout);
        $('input[name="background_repeat"]').change(myatu_bgm.updatePreviewLayout);
        $('#background_stretch_horizontal').click(myatu_bgm.updatePreviewLayout);
        $('#background_stretch_vertical').click(myatu_bgm.updatePreviewLayout);
        $('#info_tab').click(myatu_bgm.showHideInfoExtra);
        $('#clear_color').click(myatu_bgm.clearColor);
        $('input[name="change_freq"]').change(myatu_bgm.showHideBackgroundTransition);

        // Simple event
        $('#footer_debug_link').click(function() { $('#footer_debug').toggle(); return false; });
    });
})(jQuery);
