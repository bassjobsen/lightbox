/*
Lightbox for Bootstrap 3 by @ashleydw
Changed by @bassjobsen
https://github.com/ashleydw/lightbox

License: https://github.com/ashleydw/lightbox/blob/master/LICENSE
*/
+function ($) { "use strict";

  var Lightbox = function (element, options) {
     var content, footer, header, youtube;
    this.options = $.extend({
      title: null,
      footer: null,
      remote: null,
      keyboard: true,
      onShow: function() {},
      onShown: function() {},
      onHide: function() {},
      onHidden: function() {
        if (this.gallery) {
          $(document).off('keydown.Lightbox');
        }
        return this.modal.remove();
      },
      id: false
    }, options || {});
    this.$element = $(element);
    content = '';
    this.modal_id = this.options.modal_id ? this.options.modal_id : 'Lightbox-' + Math.floor((Math.random() * 1000) + 1);
    header = this.options.title ? '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h4 class="modal-title">' + this.options.title + '</h4></div>' : '';
    footer = this.options.footer ? '<div class="modal-footer">' + this.options.footer + '</div>' : '';
    $(document.body).append('<div id="' + this.modal_id + '" class="modal fade" tabindex="-1"><div class="modal-dialog"><div class="modal-content">' + header + '<div class="modal-body"></div>' + footer + '</div></div></div>');
    this.modal = $('#' + this.modal_id);
    this.modal_body = this.modal.find('.modal-body').first();
    this.padding = {
      left: parseFloat(this.modal_body.css('padding-left'), 10),
      right: parseFloat(this.modal_body.css('padding-right'), 10),
      bottom: parseFloat(this.modal_body.css('padding-bottom'), 10),
      top: parseFloat(this.modal_body.css('padding-top'), 10)
    };
    if (!this.options.remote) {
      this.error('No remote target given');
    } else {
      if (this.isImage(this.options.remote)) {
        this.preloadImage(this.options.remote, true);
      } else if (youtube = this.getYoutubeId(this.options.remote)) {
        this.showYoutubeVideo(youtube);
      } else if (this.isSwf(this.options.remote)) {
        console.log('todo');
      }
      this.gallery = this.$element.data('gallery');
      if (this.gallery) {
        this.gallery_items = this.$element.parents('*:not(.row)').first().find('*[data-toggle="lightbox"][data-gallery="' + this.gallery + '"]');
        this.gallery_index = this.gallery_items.index(this.$element);
        $(document).on('keydown.Lightbox', this.navigate.bind(this));
      }
    }
    this.modal.on('show.bs.modal', this.options.onShow.bind(this)).on('shown.bs.modal', this.options.onShown.bind(this)).on('hide.bs.modal', this.options.onHide.bind(this)).on('hidden.bs.modal', this.options.onHidden.bind(this)).modal('show', options);
    return this.modal;
    
  };
  
  
  Lightbox.DEFAULTS = {
  }
  
  Lightbox.prototype = {
    isImage: function(str) {
      return str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
    },
    isSwf: function(str) {
      return str.match(/\.(swf)((\?|#).*)?$/i);
    },
    getYoutubeId: function(str) {
      var match;
      match = str.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      if (match && match[2].length === 11) {
        return match[2];
      } else {
        return false;
      }
    },
    navigate: function(event) {
      var next, src, youtube;
      event = event || window.event;
      if (event.keyCode === 39 || event.keyCode === 37) {
        if (event.keyCode === 39 && this.gallery_index + 1 < this.gallery_items.length) {
          this.gallery_index++;
          this.$element = $(this.gallery_items.get(this.gallery_index));
          src = this.$element.attr('data-source') || this.$element.attr('href');
          if (this.isImage(src)) {
            this.preloadImage(src, true);
          } else if (youtube = this.getYoutubeId(src)) {
            this.showYoutubeVideo(youtube);
          }
          if (this.gallery_index + 1 < this.gallery_items.length) {
            next = $(this.gallery_items.get(this.gallery_index + 1), false);
            src = next.attr('data-source') || next.attr('href');
            if (this.isImage(src)) {
              return this.preloadImage(src, false);
            }
          }
        } else if (event.keyCode === 37 && this.gallery_index > 0) {
          this.gallery_index--;
          this.$element = $(this.gallery_items.get(this.gallery_index));
          src = this.$element.attr('data-source') || this.$element.attr('href');
          if (this.isImage(src)) {
            return this.preloadImage(src, true);
          } else if (youtube = this.getYoutubeId(src)) {
            return this.showYoutubeVideo(youtube);
          }
        }
      }
    },
    showLoading: function() {
      return this.modal_body.html('<div class="modal-loading">Loading..</div>');
    },
    showYoutubeVideo: function(id) {
      this.resize(560, 315);
      return this.modal_body.html('<iframe width="560" height="315" src="//www.youtube.com/embed/' + id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
    },
    error: function(message) {
      return this.modal_body.html(message);
    },
    preloadImage: function(src, onLoadShowImage) {
      var img,
        _this = this;
      img = new Image();
      if ((onLoadShowImage == null) || onLoadShowImage === true) {
        img.onload = function() {
          var i, width;
          _this.checkImageDimensions(img);
          _this.modal_body.html(img);
          i = _this.modal_body.find('img').first();
          width = i && i.width() > 0 ? i.width() : img.width;
          return _this.resize(width, i.height());
        };
        img.onerror = function() {
          return _this.error('Failed to load image: ' + src);
        };
      }
      return img.src = src;
    },
    close: function() {
      return this.modal.modal('hide');
    },
    center: function() {
      return this.modal.find('.modal-dialog').css({
        'left': function() {
          return -($(this).width() / 2);
        }
      });
    },
    resize: function(width, height) {
      width = width + this.padding.left + this.padding.right;
      this.modal.find('.modal-content').css({
        'width': width
      });
      this.modal.find('.modal-dialog').css({
        'width': width + 20
      });
      return this.center();
    },
    checkImageDimensions: function(img) {
      var w;
      w = $(window);
      if ((img.width + (this.padding.left + this.padding.right + 20)) > w.width()) {
        return img.width = w.width() - (this.padding.left + this.padding.right + 20);
      }
    }
  };

  // LIGHTBOX CLASS DEFINITION
  // ======================
var old = $.fn.lightbox

  $.fn.lightbox = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.lightbox')
      var options = $.extend({}, Lightbox.DEFAULTS, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('bs.lightbox', (data = new Lightbox(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }
   
  $.fn.lightbox.Constructor = Lightbox


  // LIGHBOX NO CONFLICT
  // =================

  $.fn.lightbox.noConflict = function () {
    $.fn.lightbox = old
    return this
  }

  // LIGHTBOX DATA-API
  // ==============

  $(document).on('click.bs.lightbox.data-api', '[data-toggle="lightbox"]', function (e) {
    var $this   = $(this)

    e.preventDefault()
    $this
      .lightbox({remote: $this.attr('data-source') || $this.attr('href')}, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })



}(window.jQuery);
