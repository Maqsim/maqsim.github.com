window.addEventListener('load', (event) => {
  $(document.body).append(
    makeEmoji(),
    makeEmoji(),
    makeEmoji(),
    makeEmoji(),
    makeEmoji(),
    makeEmoji(),
    makeEmoji(),
    makeEmoji()
  );
});

const EMOJIS = ['😇', '🎃', '😀', '😏', '😆', '🤯', '👻', '💩', '👽', '🤡'];
const BLURS = [.2, .5, 1, 2, 8];
const SIZES = [40, 50, 70, 90, 110];
function makeEmoji() {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const randomSizeAndBlur = Math.floor(Math.random() * BLURS.length);

  return $(`<div class="emoji hidden sm:block">${emoji}</div>`).css({
    top: Math.random() * document.body.scrollHeight,
    right: Math.random() * (window.innerWidth - 700),
    transform: `rotate(${Math.random() * 360}deg)`,
    filter: `blur(${BLURS[randomSizeAndBlur]}px)`,
    fontSize: SIZES[randomSizeAndBlur]
  });
}
