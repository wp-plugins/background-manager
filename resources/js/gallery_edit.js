/*!
 * Copyright (c) 2011-2012 Mike Green <myatus@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */
if(typeof myatu_bgm==="undefined"){var myatu_bgm={}}(function(b){b.extend(myatu_bgm,{GetObjSize:function(e){var f=0,a;for(a in e){if(e.hasOwnProperty(a)){f++}}return f},createCookie:function(i,h,g){var j,a;if(g){j=new Date();j.setTime(j.getTime()+(g*24*60*60*1000));a="; expires="+j.toGMTString()}else{a=""}document.cookie=i+"="+h+a+"; path=/"},readCookie:function(j){var h=j+"=",a=document.cookie.split(";"),c,i;for(i=0;i<a.length;i++){c=a[i];while(c.charAt(0)===" "){c=c.substring(1,c.length)}if(c.indexOf(h)===0){return c.substring(h.length,c.length)}}return null},deleteCookie:function(a){myatu_bgm.createCookie(a,"",-1)},image_selection:{},getImageCount:function(){return(myatu_bgm.GetAjaxData("image_count",b("#edit_id").val()))},getImagesHash:function(){return(myatu_bgm.GetAjaxData("images_hash",b("#edit_id").val()))},getImageIds:function(){return(myatu_bgm.GetAjaxData("image_ids",b("#edit_id").val()))},removeImagesOverlay:function(){b("#images_iframe").fadeIn("fast",function(){b("#image_iframe_overlay").hide()})},doDeleteRemoveImages:function(a,g){var j,i="",h=(typeof a==="undefined"||!a)?"remove_images":"delete_images";if(typeof g==="undefined"){for(j in myatu_bgm.image_selection){if(myatu_bgm.image_selection.hasOwnProperty(j)){i+=j.replace("image_","")+","}}}else{i=g}myatu_bgm.GetAjaxData(h,i);myatu_bgm.showHideEditBar(true);if(myatu_bgm.haveImagesChanged(true)){myatu_bgm.loadImagesIframe()}},doMoveImages:function(j,g){var a,i="",h=(j)?1:0;if(typeof g==="undefined"){for(a in myatu_bgm.image_selection){if(myatu_bgm.image_selection.hasOwnProperty(a)){i+=a.replace("image_","")+","}}}else{i=g}myatu_bgm.GetAjaxData("change_order",{ids:i,inc:h});myatu_bgm.showHideEditBar(true);if(myatu_bgm.haveImagesChanged(true)){myatu_bgm.loadImagesIframe()}},showHideEditBar:function(m){var j=b("#quicktags"),n=b("#selected-count"),k,l,i,a;if(m===true){l=myatu_bgm.getImageIds();for(a in myatu_bgm.image_selection){if(myatu_bgm.image_selection.hasOwnProperty(a)){i=a.replace("image_","");if(typeof l[i]==="undefined"){delete myatu_bgm.image_selection[a]}}}}k=myatu_bgm.GetObjSize(myatu_bgm.image_selection);if(k>0){j.slideDown();n.show();b("#select-count",n).html(k)}else{j.slideUp();n.hide();b("#select-count",n).html("0")}},haveImagesChanged:function(f){var e=b("#images_hash").val(),a=myatu_bgm.getImagesHash();if(a!==false&&e!==a){if(f===true){b("#images_hash").val(a)}return true}return false},loadImagesIframe:function(e){var f=b("#image_iframe_overlay"),a=b("#loader",f);if(e===undefined){e=b("#images_iframe").attr("src")}f.show();b("#image_buttons").hide();a.css("top",((f.height()-a.outerHeight())/2)+f.scrollTop()+"px");a.css("left",((f.width()-a.outerWidth())/2)+f.scrollLeft()+"px");b("#images_iframe").attr("src",e).fadeOut("fast")},showHideImageButtons:function(p){var l=b("#images_iframe").contents(),r=b("#image_buttons",l),a=b("#image_move_right_button_holder",l),q=b("#image_move_left_button_holder",l),m,k,o,n;if(!b(p).length){r.hide();a.hide();q.hide();return}k=b("img",p);o=b("#image_iframe_overlay");n=b(p).attr("id").replace("image_","");r.css("top",k.offset().top-o.scrollTop()+"px");r.css("left",k.offset().left-o.scrollLeft()+"px");r.show();m=(k.height()+k.offset().top-30)-o.scrollTop();q.css("top",m+"px");q.css("left",k.offset().left-o.scrollLeft()+"px");q.show();a.css("top",m+"px");a.css("left",(k.width()+k.offset().left-30)-o.scrollLeft()+"px");a.show();b(".image_button",l).each(function(){if(b(this).attr("id")==="image_edit_button"){b(this).attr("href",b("#image_iframe_edit_base").val()+"&id="+n+"&TB_iframe=true")}else{b(this).attr("href","#"+n)}})},onImagesIframeFinish:function(g){var a=b("#images_iframe").contents().find("html,body"),h=b("#image_container",a),f=myatu_bgm.GetAjaxData("paginate_links",{id:b("#edit_id").val(),base:b("#images_iframe_base").val(),pp:b("#images_per_page").val(),current:g});if(f!==false){b(".tablenav-pages").html(f);b(".tablenav-pages a").click(myatu_bgm.onPaginationClick)}b("#wp-word-count #image-count").html(myatu_bgm.getImageCount());b(".image",h).each(function(c){b(this).dblclick(myatu_bgm.onImageDoubleClick);b(this).click(myatu_bgm.onImageClick);if(myatu_bgm.image_selection[b(this).attr("id")]===true){b(this).addClass("selected")}});a.click(myatu_bgm.onEmptyImageAreaClick);b("#image_edit_button",a).click(myatu_bgm.onImageEditButtonClick);b("#image_del_button",a).click(myatu_bgm.onImageDeleteButtonClick);b("#image_remove_button",a).click(myatu_bgm.onImageRemoveButtonClick);b("#image_move_right_button",a).click(myatu_bgm.onImageMoveRightButtonClick);b("#image_move_left_button",a).click(myatu_bgm.onImageMoveLeftButtonClick);a.keydown(myatu_bgm.onIframeKeyDown);myatu_bgm.removeImagesOverlay()},onDeleteSelected:function(a){if(b("#image_del_is_perm").val()==="1"&&confirm(bgmL10n.warn_delete_all_images)===false){return false}myatu_bgm.doDeleteRemoveImages(true);return false},onRemoveSelected:function(a){myatu_bgm.doDeleteRemoveImages(false);return false},onMoveLeftSelected:function(a){myatu_bgm.doMoveImages(false);return false},onMoveRightSelected:function(a){myatu_bgm.doMoveImages(true);return false},onClearSelected:function(a){var d=b("#images_iframe").contents().find("#image_container");myatu_bgm.image_selection={};b(".image",d).each(function(c){if(b(this).hasClass("selected")){b(this).removeClass("selected")}});myatu_bgm.showHideEditBar(false);return false},onPaginationClick:function(a){myatu_bgm.loadImagesIframe(b(this).attr("href"));return false},onImageDoubleClick:function(a){var d=b(this).attr("id");b(this).toggleClass("selected");if(b(this).hasClass("selected")){myatu_bgm.image_selection[d]=true}else{delete myatu_bgm.image_selection[d]}myatu_bgm.showHideEditBar(false);return false},onImageClick:function(a){b("#images_iframe").contents().find(".image").removeClass("highlighted");b(this).addClass("highlighted");myatu_bgm.showHideImageButtons(this);return false},onEmptyImageAreaClick:function(a){b("#images_iframe").contents().find(".image").removeClass("highlighted");myatu_bgm.showHideImageButtons()},onImageEditButtonClick:function(a){tb_show(b(this).attr("title"),b(this).attr("href"));return false},onImageDeleteButtonClick:function(a){if(b("#image_del_is_perm").val()==="1"&&confirm(bgmL10n.warn_delete_image)===false){return false}myatu_bgm.doDeleteRemoveImages(true,b(this).attr("href").replace("#",""));return false},onImageRemoveButtonClick:function(a){myatu_bgm.doDeleteRemoveImages(false,b(this).attr("href").replace("#",""));return false},onImageMoveLeftButtonClick:function(a){myatu_bgm.doMoveImages(false,b(this).attr("href").replace("#",""));return false},onImageMoveRightButtonClick:function(a){myatu_bgm.doMoveImages(true,b(this).attr("href").replace("#",""));return false},onIframeKeyDown:function(h){var j=b("#images_iframe").contents().find("html,body"),g=b("#image_container",j),i=b(".image.highlighted",g),a=function(c){if(!i.length&&typeof c!=="undefined"){i=b(".image:"+c,g).addClass("highlighted")}myatu_bgm.showHideImageButtons();if(j.length&&i.length){j.scrollTo(i)}};switch(h.keyCode){case 32:i.dblclick();return false;case 37:i=i.removeClass("highlighted").prev(".image").addClass("highlighted");a("last");return false;case 39:i=i.removeClass("highlighted").next(".image").addClass("highlighted");a("first");return false}},initEditWindowResize:function(){var h=b("#editorcontainer"),a,f,g;if(!h.length){return}g=myatu_bgm.readCookie("mbgm_editor_height");if(g&&g>150){h.height(g)}b(mainWin).mousemove(function(c){if(!h.data("active")){return}f=c.pageY;a=h.data("last_seen");if(a){g=h.height()+(f-a);if(g>150){h.height(g)}}h.data("last_seen",f)});b("#resize_window").mousedown(function(c){h.data("active",true);c.preventDefault()});b(mainWin).mouseup(function(){h.data("active",false);h.data("last_seen",false);myatu_bgm.createCookie("mbgm_editor_height",h.height(),365)})}});b(document).ready(function(a){if(typeof mainWin!=="undefined"){mainWin.send_to_editor=function(d){tb_remove()};mainWin.tb_remove=function(){a("#TB_imageOff").unbind("click");a("#TB_closeWindowButton").unbind("click");a("#TB_window").fadeOut("fast",function(){a("#TB_window,#TB_overlay,#TB_HideSelect").trigger("unload").unbind().remove()});a("#TB_load").remove();if(typeof document.body.style.maxHeight==="undefined"){a("body","html").css({height:"auto",width:"auto"});a("html").css("overflow","")}document.onkeydown="";document.onkeyup="";if(myatu_bgm.haveImagesChanged(true)){myatu_bgm.loadImagesIframe()}return false}}a("#ed_delete_selected").click(myatu_bgm.onDeleteSelected);a("#ed_clear_selected").click(myatu_bgm.onClearSelected);a("#ed_remove_selected").click(myatu_bgm.onRemoveSelected);a("#ed_move_l_selected").click(myatu_bgm.onMoveLeftSelected);a("#ed_move_r_selected").click(myatu_bgm.onMoveRightSelected);myatu_bgm.initEditWindowResize()})}(jQuery));