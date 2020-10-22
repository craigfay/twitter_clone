
function humanReadableDate(timestamp) {
  let date = new Date(timestamp);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
  return year == new Date().getFullYear()
    ? `${month} ${day}`
    : `${month} ${day}, ${year}`
}

function makeLinksClickable(textContent) {
  //URLs starting with http://, https://, or ftp://
  let replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  textContent = textContent.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  let replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  textContent = textContent.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  //Change email addresses to mailto:: links.
  let replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  textContent = textContent.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return textContent;
}

async function buildNewsFeed() {
  const tweets = await fetch('tweets.json')
    .then(r => r.json())

  const newsFeed = document.createElement('div');
  newsFeed.classList.add('news-feed');

  for (let tweet of tweets) {
    const authorName = document.createElement('span');
    authorName.innerText = tweet.authorName;
    authorName.classList.add('author-name');

    const authorHandle = document.createElement('span');
    authorHandle.innerText = tweet.authorHandle;
    authorHandle.classList.add('author-handle');

    const postedAt = document.createElement('span');
    postedAt.innerText = humanReadableDate(tweet.postedAt);
    postedAt.classList.add('posted-at');

    const textContent = document.createElement('p');
    textContent.innerHTML = makeLinksClickable(tweet.textContent);
    textContent.classList.add('text-content');

    const image = document.createElement('img');
    image.src = tweet.imageSource;
    image.classList.add('image');

    const tweetElement = document.createElement('div');
    tweetElement.classList.add('tweet');

    tweetElement.appendChild(authorName);
    tweetElement.appendChild(authorHandle);
    tweetElement.appendChild(postedAt);
    tweetElement.appendChild(textContent);
    tweetElement.appendChild(image);

    newsFeed.appendChild(tweetElement);
  }

  document.querySelector('body').appendChild(newsFeed);

}

buildNewsFeed();
