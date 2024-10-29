const axios = require('axios');
const cypressSplit = require('cypress-split');
const { determineSplit, determineSplitIndex } = require('./services/split');
const os = require('os');

const cypressSplitLocalDocker = async (on, config) => {
  if (process.env.LOCAL === 'true') {
    let socketPath = '/var/run/docker.sock';
    const platform = os.platform();
    if (platform.startsWith('win')) {
      socketPath = '//./pipe/docker_engine';
    }

    const containers = (
      await axios.get('http://localhost/v1.41/containers/json', {
        socketPath: socketPath,
      })
    ).data;
    const containerId = process.env.HOSTNAME;
    // eslint-disable-next-line no-param-reassign
    config.env.split = determineSplit(containers, containerId);
    // eslint-disable-next-line no-param-reassign
    config.env.splitIndex = determineSplitIndex(containers, containerId);
  }
  cypressSplit(on, config);
};

module.exports = cypressSplitLocalDocker;
