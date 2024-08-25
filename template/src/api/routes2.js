import { File } from '@asyncapi/generator-react-sdk';
import { kebabCase, getOperationIds, pathResolve } from '../helpers/index';

export default function RoutesFile({ asyncapi }) {
  const imports = asyncapi.channels().all().map(channel => {
    const channelName = channel.id();
    const allOperationIds = getOperationIds(channel);
    return `const { ${allOperationIds.join(', ')} } = require('./services/${kebabCase(channelName)}');`;
  }).join('\n');

  const routes = asyncapi.channels().all().map(channel => {
    const channelName = channel.id();
    const hasSubscribe = channel.operations().filterByReceive().length > 0;
    const hasPublish = channel.operations().filterBySend().length > 0;

    return `router.ws('${pathResolve(channelName)}', async (ws, req) => {
  const path = pathParser(req.path);
  console.log(\`\${yellow(path)} client connected.\`);
  ${hasSubscribe ? `await ${channel.operations().filterByReceive()[0].id()}(ws);` : ''}

  ${hasPublish ? `ws.on('message', async (msg) => {
    console.log(\`\${yellow(path)} message was received:\`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await ${channel.operations().filterBySend()[0].id()}(ws, { message: msg, path, query: req.query });
  });` : ''}
});`;
  }).join('\n\n');

  return (
    <File name="routes.js">
      {`const util = require('util');
const { Router } = require('express');
const { pathParser } = require('../lib/path');
const { yellow } = require('../lib/colors');
${imports}

const router = Router();
module.exports = router;

${routes}`}
    </File>
  );
}