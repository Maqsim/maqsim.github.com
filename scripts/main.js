$(document).ready(function () {
  const principles = [
    `I follow KISS principle everywhere it's possible`,
    `My productivity hardly depends on how much interesting a project is`,
    `I love develop fast and test just after`,
    `I am open-minded`,
    `The perfect is the enemy of the good`,
    `I care about performance`,
    `Don't interrupt me when I develop`,
    `I hate offices. Maybe once...`,
    `WebStorm ❤️`
  ];

  $('.section.principles').append(
    shuffle(principles)
      .map(principle => `
            <div class="slide">
              <div class="section-content">
                <p>${principle}</p>
              </div>
            </div>
          `)
      .concat()
  );

  $('#fullpage').fullpage({
    anchors: ['about', 'portfolio', 'music', 'principles', 'contacts'],
    sectionsColor: ['#fff', '#fff', '#ff5500', '#fff', '#fff', '#fff'],
    css3: true,
    navigation: true,
    menu: '.menu',
    scrollingSpeed: 700,
    showActiveTooltip: true,
    slidesNavigation: true,
    loopTop: false,
    loopBottom: false,
    lazyLoading: false,
    recordHistory: false,
    controlArrows: false,

    onLeave: function (origin, destination) {
      closeMenu();

      switch (destination) {
        case 2:
        case 4:
        case 5:
          $('.menu-container').addClass('__black');
          break;
        default:
          $('.menu-container').removeClass('__black');
      }
    }
  });

  $('.burger').click(e => {
    $(e.currentTarget).toggleClass('__opened');
  });

  $('.menu li').click(closeMenu);
});

function closeMenu() {
  $('.burger').removeClass('__opened');
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
