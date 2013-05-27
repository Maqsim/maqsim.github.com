(function($) {

  function randowWords(text, count, charLimit) {
    if (!text) return text;
    count = count || 1;
    charLimit = charLimit || 3;
    var words = [];
    $.unique(text.match(/([a-zа-я0-9])+/img)).map(function(word){
      if(word.length >= charLimit) words.push(word);
    });
    var random = [];

    for(var i=0; i<count; i++) {
        var rn = Math.floor(Math.random() * words.length);
        random.push( words[rn]);
        words.splice(rn, 1);
    }

    return random;
  }

  function clearTimers(timers) {
    $.each(timers, function(){
      clearTimeout(this);
    });
    return [];
  }

$.fn.slideShow = function(options) {
  if (!this.length) { return this; }

  var opts = $.extend(true, {}, $.fn.slideShow.defaults, options);
  var $section = this;
  var $figures = $section.find('figure');
  var firstSlideIndex = opts.firstSlideIndex-1 || 0;
  var currentSlideIndex = firstSlideIndex;
  var w = $(window).width();
  var timers = [];

  $section.hover(function(){
    $(this).append('<span class="startCaption" style="font-size: '+opts.width/4+'px">'+$(this).data('startcaption')+'</span>');
  }, function(){
    $(this).find('span.startCaption').remove();
  }).click(function(){
      if(!$('section#slideShow').length) {
        $('body').append('<section id="overlay"></section><section id="slideShow"><div class="next">NEXT</div><div class="prev">PREV</div><div class="close">x</div></section><section id="navigation"><div class="desc"></div><div class="points"></div></section>');
      }
      $section = $(this);
      $figures = $('figure', this);
      $('section#slideShow').show().animate({'opacity': 1, 'top': 0}, 250, 'swing');
      $figures.each(function(){
          var margin = w/$figures.length;
          var html = $('figcaption', this).length || $.trim($('figcaption', this).text())?randowWords($('figcaption', this).text(), 2).join(' ') : '<div class="point">'+($(this).index()+1)+'</div>';
          $('<a>', {'href': '#', 'html': html}).css({'width': margin}).appendTo('section#navigation div.points');
        });

      $('section#navigation').show().animate({'opacity': 1, 'bottom': 0}, 500, 'swing');
      $('section#overlay').fadeIn(150);

      $('section#navigation div.points a').click(function(){
        currentSlideIndex = $(this).index();
        timers = clearTimers(timers);
        if(!$(this).hasClass('selected')) showSlide($(this).index(), $section);

        if (opts.autoScroll) {
          timers[timers.length] = setTimeout(function(){
            $('section#slideShow div.next').click();
          }, opts.scrollDelay);
        }

      }).eq(firstSlideIndex).click();

      $('section#slideShow div.next').click(function() {
        if ($section.find('figure').eq(currentSlideIndex+1).length) ++currentSlideIndex;
        else currentSlideIndex = 0;
        $('section#navigation div.points a').eq(currentSlideIndex).click();
      });

      $('section#slideShow div.prev').click(function(){
        if ($section.find('figure').eq(currentSlideIndex-1).length && currentSlideIndex > 0) --currentSlideIndex;
        else currentSlideIndex = $section.find('figure').length-1;
        $('section#navigation div.points a').eq(currentSlideIndex).click();
      });

      $('section#slideShow div.close').click(function() {

        $('section#slideShow').animate({'opacity': 0, 'top': '-5%'}, 250, 'swing');
        $('section#navigation').show().animate({'opacity': 0, 'bottom': '-3%'}, 500, 'swing');
        $('section#overlay').fadeOut(500);
        setTimeout(function(){
          $('section#overlay, section#slideShow, section#navigation').empty().remove();
          timers = clearTimers(timers);
        }, 300);

      });
      //showSlide(firstSlideIndex, $section);
  });
  $figures.each(function() {
    var rand = parseInt(Math.random() * 15);
    rand = Math.round(Math.random())?rand:-rand;
    $(this).find('figcaption').hide().end().css({'transform': 'rotate('+rand+'deg)', 'margin-left': rand}).find('img').width(opts.width);
  });

  $section.width(opts.width + opts.width*.3).height(opts.width*2);

  var showSlide = function(slideIndex, $section) {
    $figure = $section.find('figure').eq(slideIndex);
    if(!$figures.eq(slideIndex).length) return false;
    $('section#navigation div.points a').removeClass('selected').eq(slideIndex).addClass('selected');
    if (!$('section#slideShow div.mainContainer').length) {
      $image = $('<div>', {'class': 'mainContainer'}).appendTo('section#slideShow');
    } else {
      $image = $('section#slideShow div.mainContainer');
      var animate = true;
    }
    if (animate) {
      $image.fadeOut(500, function(){
        $(this).html('<img src="'+$figure.find('img').attr('src')+'" alt="" style="width: 100%; position: absolute">').fadeIn(500);
        $('<div>', {'class': 'bigText', 'html': $figure.find('figcaption').html()}).appendTo('section#slideShow div.mainContainer');
      })
    } else {
      $image.html('<img src="'+$figure.find('img').attr('src')+'" alt="" style="width: 100%; position: absolute">');
      $('<div>', {'class': 'bigText', 'html': $figure.find('figcaption').html()}).appendTo('section#slideShow div.mainContainer');
    }

    timers[timers.length] = setTimeout(function(){
      $image.find('img').stop().animate({'margin-top':  -$('section#slideShow > div > img').height()+$('section#slideShow').height()}, 60000);
    }, 3000);
    return true;
  }



  return this;
};

// default options
$.fn.slideShow.defaults = {
  width: 500,
  autoScroll: false,
  scrollDelay: 5000
};

})(jQuery);