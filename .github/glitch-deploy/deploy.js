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


const listProject = `https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/lovely-cyan-bougon|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/striped-indigo-laundry|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/nebula-scandalous-kayak|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/gentle-stellar-trawler|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/glittery-zesty-modem|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/pumped-atlantic-oregano|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/educated-triangular-moss|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/shy-snow-chronometer|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/lemon-sassy-opportunity|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/sunny-complex-toucan|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/vigorous-momentous-diploma|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/sore-flaxen-porpoise|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/knowledgeable-dirt-riverbed|https://29550efe-7c83-411e-820d-227cccd180a7@api.glitch.com/git/jeweled-fog-sandpaper`.trim().split('|');

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