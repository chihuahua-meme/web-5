const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/rebel-cold-soprano|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/cat-gem-goose|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/alike-shy-dash|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/actually-cheerful-bull|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/fire-grizzled-zenith|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/slime-crystalline-pair|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/bush-brook-snowboard|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/wise-shimmer-cardboard|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/nutritious-sulfuric-myrtle|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/gusty-leather-tumble|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/long-adventurous-double|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/pear-elemental-pixie|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/shimmer-wind-lily|https://de5eda4d-61cd-4a6d-810d-cf220c2e3b79@api.glitch.com/git/lavender-encouraging-cornet`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();