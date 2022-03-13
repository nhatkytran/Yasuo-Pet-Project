const allGames = document.querySelector('.sb-ag-body__left');
const allGamesItems = document.querySelectorAll('.sb-ag-body__left-link');
const agMainPoster = document.querySelector('.sb-ag-body__right');

const hoverMarkupBackground = [
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(17, 113, 200) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(80, 104, 125) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(67, 37, 87) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(139, 121, 229) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(84, 163, 227) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(160, 193, 236) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(172, 76, 84) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(116, 193, 175) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(173, 110, 137) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(66, 88, 166) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(48, 76, 64) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(90, 190, 205) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(147, 34, 28) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(43, 61, 109) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(35, 83, 87) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(121, 49, 123) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(212, 190, 179) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(0, 61, 90) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(252, 63, 67) 0%, rgb(10, 10, 10) 70%);',
  'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(234, 0, 40) 0%, rgb(10, 10, 10) 70%);',
];

const hoverMarkupQuote = [
  "Earn in-game rewards and learn more about Riot's games",
  'Face off in the ultimate 5v5 battle arena',
  'Style on your enemies in this 5v5 tactical shooter',
  'A TEAM-BUILDING BATTLE OF WITS',
  'Master every moment in this strategy card game',
  'LEAGUE OF LEGENDS, NOW ON MOBILE',
  'Riot Forge Presents Hextech Mayhem',
  'RISE AGAINST RUIN IN THIS TURN BASED RPG',
  'EXPLORE ZAUN AS EKKO IN THIS ACTION PLATFORMER',
  'A Song Lives Forever',
  'PUBLISHER OF COMPLETABLE EXPERIENCES FROM THE LEAGUE UNIVERSE',
  '',
  '',
  'AN ANIMATED SERIES ON NETFLIX FROM THE WORLD OF LEAGUE OF LEGENDS',
  'THE DEFINITIVE SOURCE FOR THE WORLD OF LEAGUE OF LEGENDS',
  'MUSIC HAS A NEW HOME',
  'UNLEASH PLAY',
  'THE OFFICIAL HOME OF RIOT GAMES MERCH',
  'YOUR MOBILE COMPANION FOR ALL THINGS RIOT GAMES',
  'FROM TECH TO TILT, WE ARE HERE TO HELP YOU',
];

const hoverMarkupSEO = [
  'ARCANE',
  'LEAGUE OF LEGENDS',
  'VALORANT',
  'TEAMFIGHT TACTICS',
  'LEGENDS OF RUNETERRA',
  'LOL: WILD RIFT',
  'HEXTECH MAYHEM',
  'RUINED KING',
  'CONV/RGENCE',
  'SONG OF NUNU',
  'RIOT FORGE GAMES',
  'LOL ESPORTS',
  'VALORANT ESPORTS',
  'ARCANE',
  'UNIVERSE',
  'RIOT GAMES MUSIC',
  'RIOT GAMES',
  'RIOT MERCH',
  'RIOT MOBILE',
  'RIOT SUPPORT',
];

allGamesItems.forEach((item, index) => {
  item.setAttribute('data-agi-id', `ag__img--${index + 1}`);
});

let hovered;
let timeout;
const checkHover = function (event) {
  if (event.target.closest('.sb-ag-body__left-link')) {
    hovered = true;
  } else {
    hovered = false;
  }

  if (hovered !== checkHover.hovered) {
    if (hovered) {
      clearTimeout(timeout);
      if (document.querySelector('.sb-ag-body__right--hover')) {
        document.querySelector('.sb-ag-body__right--hover').remove();
      }

      const img = event.target.dataset.agiId;
      const text = event.target.dataset.photoText;

      agMainPoster.classList.add('hide');
      agMainPoster.insertAdjacentHTML('afterbegin', hoverMarkup(img, text));
    } else {
      timeout = setTimeout(function () {
        document.querySelector('.sb-ag-body__right--hover').remove();
        agMainPoster.classList.remove('hide');
      }, 100);
    }
  }

  checkHover.hovered = hovered;
};
checkHover.hovered = false;

allGames.addEventListener('mousemove', checkHover);

// 14: From "Univers with index 14, poster use text instaed if png or svg"
// [1, 7, 9, 10, 13] => png
const hoverMarkup = function (img) {
  const index = +img?.slice(img.length - 2, img.length).replace('-', '') - 1;

  return `
    <div class="sb-ag-body__right--hover">
      <div class="sb-ag-body__right--hover-frame"></div>
      <div class="ag__hover-content" style="${hoverMarkupBackground[index]}">
        <div class="ag__hover-content--child">
          <div class="ag__hover-imgs-cover">
            <img
              class="ag__hover-imgs ${index >= 14 ? 'hide' : ''}"
              src="./src/img/nav-ag/${img}s.${
    [1, 7, 9, 10, 13].indexOf(index + 1) !== -1 ? 'png' : 'svg'
  }"
              alt="ARCANE"
              title="ARCANE"
            />
            <span class="ag__hover-imgs--text ${
              index < 14 ? 'hide' : ''
            }">UNIVERSE</span>
          </div>
          <p class="ag__hover-text">
            ${hoverMarkupQuote[index]}
          </p>
          <div class="ag__hover-icon">
            <svg
              width="8"
              height="8"
              class="ag__hover-icon--1"
              viewBox="0 0 10 10"
            >
              <title>platform_windows_transp</title>
              <path
                d="M0 1.416L4.087.86l.002 3.929-4.084.023L0 1.416zm4.085 3.827l.003 3.933-4.085-.56V5.218l4.082.026zM4.58.79L9.998 0v4.741l-5.418.042V.79zM10 5.279L9.998 10 4.58 9.238l-.008-3.966L10 5.28z"
              ></path>
            </svg>
            <svg
              width="8"
              height="8"
              class="ag__hover-icon--2"
              viewBox="0 0 7 10"
            >
              <title>platform_phone_transp</title>
              <path
                d="M2.5 8.125a.624.624 0 101.249.001.624.624 0 00-1.249 0zM0 .938v8.125C0 9.58.42 10 .938 10h4.375c.517 0 .937-.42.937-.937V.938A.938.938 0 005.312 0H.938A.938.938 0 000 .938zm.938 8.007v-7.89c0-.065.052-.117.117-.117h4.14c.065 0 .117.052.117.117v7.89a.118.118 0 01-.117.118h-4.14a.118.118 0 01-.117-.118z"
              ></path>
            </svg>
            <svg
              width="8"
              height="8"
              class="ag__hover-icon--3"
              viewBox="0 0 11 10"
            >
              <title>platform_switch_transp</title>
              <path
                d="M3.015.033a2.584 2.584 0 00-2.05 1.884c-.09.35-.097.555-.086 3.27.006 2.492.008 2.55.05 2.742.23 1.038.966 1.777 2.014 2.021.137.031.31.038 1.43.044 1.16.008 1.28.006 1.311-.025.031-.031.033-.43.033-4.961 0-3.358-.006-4.94-.02-4.97C5.676.003 5.64 0 4.427.003c-.985.002-1.281.008-1.412.03zM4.89 5.002v4.195l-.842-.01c-.777-.009-.86-.013-1.015-.052a1.756 1.756 0 01-1.3-1.355c-.046-.209-.046-5.36-.002-5.565A1.778 1.778 0 012.802.933c.273-.11.4-.122 1.286-.124l.801-.002v4.195z"
                fill="#7E7E7E"
              ></path>
              <path
                d="M3.193 2.074c-.13.025-.329.124-.434.217-.218.188-.325.456-.309.77a.651.651 0 00.085.34c.097.2.244.348.445.447a.643.643 0 00.354.083c.164.006.222 0 .332-.037.449-.152.72-.588.643-1.036a.951.951 0 00-1.116-.784z"
                fill="#7E7E7E"
              ></path>
              <path
                d="M6.726.015c-.009.006-.015 2.25-.015 4.987 0 4.516.002 4.974.033 4.986.056.02 1.663.013 1.862-.008a2.585 2.585 0 002.14-1.729c.131-.39.127-.286.127-3.261 0-2.375-.004-2.729-.033-2.88A2.57 2.57 0 008.732.03C8.587.005 8.363 0 7.642 0c-.496 0-.91.005-.916.014zm2.21 4.51c.324.084.589.33.697.645.068.195.066.48-.002.659a1.022 1.022 0 01-.694.641 1.02 1.02 0 01-1.22-.691 1.187 1.187 0 01.009-.584 1.005 1.005 0 011.21-.67z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <img
        class="ag__hover-img"
        src="./src/img/nav-ag/${img}.jpeg"
        alt="ARCANE"
        title="ARCANE"
      />
    </div>
  `;
};
