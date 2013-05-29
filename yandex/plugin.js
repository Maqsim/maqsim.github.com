/**
 * jQuery плагин для создания слайд-шоу.
 * https://github.com/Maqsim/maqsim.github.com/tree/master/yandex
 *
 * (c) 2013 vk.com/kaleid05cope
 */
(function($) {
  /**
   * Возвращает случайные слова.
   *
   * @param {string} text Исходная строка.
   * @param {number} count Количество возвращаемых слов. По-умолчанию = 1.
   * @param {number} charLimit Порог символов в слове. Игнорировать его, если длина слова меньше чем порог. По-умолчанию = 3.
   * @return {array} Набор из count случайных слов строки text.
   */
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

  /*
   * Очищает все Timeout'ы.
   *
   * @param {array} timers Масив с ID таймеров.
   * @return {array} Пустой массив. Для timers = clearTimers(timers).
   */
  function clearTimers(timers) {
    $.each(timers, function(){
      clearTimeout(this);
    });
    return [];
  }

  /*
   * Функция плагина slideShow.
   *
   * @constructor
   * @this {$('section')}
   * @param {object} options Параметры.
   * @return {jQuery object} Возвращает тот набор, который получил на вход.
   */
  $.fn.slideShow = function(options) {
    // Если получили пустой набор, то завершаем работу алгоритма и возвращаем тот же набор в потом
    if (!this.length) return this;
    // Расширяем параметры по-умолчанию (объект defaults) объектом options
    var opts = $.extend(true, {}, $.fn.slideShow.defaults, options);
    var $section = this;
    var $figures = $section.find('figure');
    var firstSlideIndex = opts.firstSlideIndex-1 || 0;
    var currentSlideIndex = firstSlideIndex;
    var w = $(window).width();
    var timers = [];

    // При наведении на "набор из картинок" показывает сообщение из data-startcaption в <section>
    $section.hover(function() {
      // Создаем "абсолютный" элемент с динамическим размером шрифта и помещаем его на передний план
      $(this).append('<span class="startCaption" style="font-size: '+opts.width/4+'px">'+$(this).data('startcaption')+'</span>');
    }, function() {
      // При mouseOut удаляем созданный ранее элумент
      $(this).find('span.startCaption').remove();
    });

    // При откритии слайд шоу..
    $section.click(function() {
        // Если <section id='slideShow'> еще не создан(первый раз открываем), то создаем набор необходимых(ВАЖНЫХ!) элементов
        if(!$('section#slideShow').length)
          $('body').append('                  \
            <section id="overlay"></section>  \
            <section id="slideShow">          \
              <div class="next">NEXT</div>    \
              <div class="prev">PREV</div>    \
              <div class="close">x</div>      \
            </section>                        \
            <section id="navigation">         \
              <div class="desc"></div>        \
              <div class="points"></div>      \
            </section>                        \
          ');
        $section = $(this);
        $figures = $('figure', this);

        // АНИМАЦИЯ

        // Показываем задний фон
        $('section#overlay').fadeIn(150);
        // Показываем #slideShow
        $('section#slideShow').show().animate({'opacity': 1, 'top': 0}, 250, 'swing');
        // Форимуем панель навигации
        $figures.each(function() {
            var margin = w/$figures.length;
            var words = $('figcaption', this).text();
            var html = $.trim(words) ?
                                  (words.split(' ').length <=2 ?
                                    words
                                    :
                                    randowWords(words, 2).join(' ')
                                  )
                                  :
                                  '<div class="point">'+($(this).index()+1)+'</div>';

            $('<a>', {'href': '#', 'html': html}).css({'width': margin}).appendTo('section#navigation div.points');
          });
        // Показываем панель навигации
        $('section#navigation').show().animate({'opacity': 1, 'bottom': 0}, 500, 'swing');

        // ОБРАБОТЧИКИ СОБЫТИЙ

        // При клике на элемент в навигации..
        $('section#navigation div.points a').click(function() {
          currentSlideIndex = $(this).index();
          // очищаем все таймеры с предыдущего слайда
          timers = clearTimers(timers);
          // Блокируем выбор текушего слайда
          if(!$(this).hasClass('selected')) showSlide($(this).index(), $section);
          // Если есть автопереключение слайдов, то с интервалом в autoScrollDelay мс
          // переключаем слайды, программно кликая на переключатель "NEXT"
          if (opts.autoScrollDelay)
            timers[timers.length] = setTimeout(function() {
              $('section#slideShow div.next').click();
            }, opts.autoScrollDelay);
        }).eq(firstSlideIndex).click(); // После того, как мы описали обработчик события переключения слайдов, кликаем на firstSlideIndex слайд

        // Переключатель "NEXT" на следующий слайд
        $('section#slideShow div.next').click(function() {
          // Если текущий слайд не конечный, то переходим на следующий слайд
          if ($section.find('figure').eq(currentSlideIndex+1).length) ++currentSlideIndex;
          // иначе, на первый
          else currentSlideIndex = 0;
          $('section#navigation div.points a').eq(currentSlideIndex).click();
        });

        // Переключатель "PREV" на пердыдущий слайд
        $('section#slideShow div.prev').click(function() {
          // Если текущий слайд не первый, то переходим на предыдущий слайд
          if ($section.find('figure').eq(currentSlideIndex-1).length && currentSlideIndex > 0) --currentSlideIndex;
          // иначе, на последний
          else currentSlideIndex = $section.find('figure').length-1;
          $('section#navigation div.points a').eq(currentSlideIndex).click();
        });

        // Кнопка закрытия слайд шоу
        $('section#slideShow div.close').click(function() {
          // Анимированное исчезнвоение всех элементов слайдера и их удаление из DOM
          $('section#slideShow').animate({'opacity': 0, 'top': '-5%'}, 250, 'swing', function() {$(this).empty().remove()});
          $('section#navigation').show().animate({'opacity': 0, 'bottom': '-3%'}, 500, 'swing', function() {$(this).empty().remove()});
          $('section#overlay').fadeOut(500, function() {$(this).empty().remove()});
          timers = clearTimers(timers);
        });
    }); //end section.click function

    // Каждый <figure> поворачиваем на случайны уголв от -15 до 15 и скрываем в <figcaption>
    $figures.each(function() {
      var rand = parseInt(Math.random() * 15);
      rand = Math.round(Math.random())?rand:-rand;
      $(this).find('figcaption').hide().end().css({'transform': 'rotate('+rand+'deg)', 'margin-left': rand}).find('img').width(opts.width);
    });
    // Изменяем размеры <section> для парвильного расположения на странице среди других элементов
    $section.width(opts.width + opts.width*.3).height(opts.width*2);


    /*
     * Функция переключения слайдов.
     *
     * @this {DOM Element}
     * @param {number} slideIndex Номер слайда.
     * @param {jQuery object} $section В каком section находиться нужный слайд.
     * @return {boolean} Результат перехода
     */
    var showSlide = function (slideIndex, $section) {
      var $figures = $section.find('figure');
      var $figure = $figures.eq(slideIndex);
      // Если нет такого слайда возвращаем false
      if(!$figure.length) return false;
      // Подсвечиваем выбранный слайд в навигации
      $('section#navigation div.points a').removeClass('selected').eq(slideIndex).addClass('selected');
      // Если не создан mainContainer..
      if (!$('section#slideShow div.mainContainer').length) {
        // то создаем его
        $image = $('<div>', {'class': 'mainContainer'}).appendTo('section#slideShow');
        // плавный переход в этом случае выключен animate = false(undefined)
      } else {
        // Иначе получаем к нему доступ и включаем плавные переход
        $image = $('section#slideShow div.mainContainer');
        var animate = true;
      }
      // Показываем слайд с анимацией или без
      if (animate) {
        $image.fadeOut(500, function() {
          $(this).html('<img src="'+$figure.find('img').attr('src')+'" alt="" style="width: 100%; position: absolute">').fadeIn(500);
          $('<div>', {'class': 'bigText', 'html': $figure.find('figcaption').html()}).appendTo('section#slideShow div.mainContainer');
        })
      } else {
        $image.html('<img src="'+$figure.find('img').attr('src')+'" alt="" style="width: 100%; position: absolute">');
        $('<div>', {'class': 'bigText', 'html': $figure.find('figcaption').html()}).appendTo('section#slideShow div.mainContainer');
      }
      // Если выключено автопереключение слайдов, то прокручиваем картинку сврху вниз за scrollSlide мс
      if (!opts.autoScrollDelay)
        timers[timers.length] = setTimeout(function() {
          $image.find('img').stop().animate({'margin-top': -$('section#slideShow > div > img').height()+$('section#slideShow').height()}, opts.scrollSlide);
        }, 3000);
      return true;
    } // end showSlide function

    return this;
  } // end slideShow plugin function

  /*
   * Параметры options по-умолчанию.
   */
  $.fn.slideShow.defaults = {
    width: 500,
    autoScrollDelay: 0,
    scrollSlide: 60000
  };
})(jQuery);