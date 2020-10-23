
function humanReadableDate(timestamp) {
  // Given an ISO formatted timestamp string,
  // return a more human-friendly date.
  let date = new Date(timestamp);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
  return year == new Date().getFullYear()
    ? `${month} ${day}`
    : `${month} ${day}, ${year}`

  // For more info about ISO dates:
  // https://en.wikipedia.org/wiki/ISO_8601
}

function makeLinksClickable(textContent) {
  // Given a chunk of text, return the same chunk of text,
  // but with all the URLs replaced with clickable HTML links.

  // Handling URLs starting with http://, https://, or ftp://
  let replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  textContent = textContent.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  // Handling URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  let replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  textContent = textContent.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  // Handling email addresses
  let replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  textContent = textContent.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return textContent;
}

function approximate(quantity) {
  // Given a potentially large number,
  // return a more compact abbreviation.

  if (quantity > 1000) {
    return `${(quantity / 1000).toFixed(1)}k`
  }
  return quantity;
}

async function buildNewsFeed() {
  // Fetching a list of "tweet objects", and using the
  // data inside to create HTML elements, then attaching
  // the tweet elements to the page.

  let tweets = await fetch('tweets.json')
    .then(r => r.json())

  let newsFeed = document.createElement('div');
  newsFeed.classList.add('news-feed');

  for (let tweet of tweets) {

    let authorName = document.createElement('span');
    authorName.innerText = tweet.authorName;
    authorName.classList.add('author-name');

    let authorHandle = document.createElement('span');
    authorHandle.innerText = tweet.authorHandle;
    authorHandle.classList.add('author-handle');

    let postedAt = document.createElement('span');
    postedAt.innerText = humanReadableDate(tweet.postedAt);
    postedAt.classList.add('posted-at');

    let textContent = document.createElement('p');
    textContent.innerHTML = makeLinksClickable(tweet.textContent);
    textContent.classList.add('text-content');

    let image = document.createElement('img');
    image.src = tweet.imageSource;
    image.classList.add('image');

    let actionTray = document.createElement('div');
    actionTray.classList.add('action-tray');


    function createAction (className, textContent = '') {
      // Given an icon class name, and some text, return
      // an HTML element that creates a click-able icon.
      let action = document.createElement('div');
      action.classList.add('action');

      let icon = document.createElement('div');
      icon.classList.add(className);
      icon.classList.add('icon');

      let text = document.createElement('span');
      text.classList.add('action-text');
      text.innerText = textContent;

      action.appendChild(icon);

      if (textContent) {
        action.appendChild(text);
      }

      return action;
    }


    // Creating "action icons" that allow viewers to interact
    // with the tweet being displayed.
    let reply = createAction('reply', approximate(tweet.replyCount));
    let retweet = createAction('retweet', approximate(tweet.retweetCount));
    let like = createAction('like', approximate(tweet.likeCount));
    let share = createAction('share');


    let tweetElement = document.createElement('div');
    tweetElement.classList.add('tweet');

    if (tweet.retweetedByName) {
      let retweetedBy = document.createElement('span');
      retweetedBy.innerText = `Reposted by ${tweet.retweetedByName}`
      retweetedBy.classList.add('retweeted-by');
      tweetElement.appendChild(retweetedBy);
    }

    tweetElement.appendChild(authorName);
    tweetElement.appendChild(authorHandle);
    tweetElement.appendChild(postedAt);
    tweetElement.appendChild(textContent);
    tweetElement.appendChild(image);
    tweetElement.appendChild(actionTray);

    actionTray.appendChild(reply);
    actionTray.appendChild(retweet);
    actionTray.appendChild(like);
    actionTray.appendChild(share);

    newsFeed.appendChild(tweetElement);
  }

  document.querySelector('body').appendChild(newsFeed);
}

buildNewsFeed();
