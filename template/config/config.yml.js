import { File } from '@asyncapi/generator-react-sdk';
import { port } from '../../helpers/index';

export default function CommonConfigYAMLRender({ asyncapi, params }) {
  const serverUrl = asyncapi.server(params.server).url();

  return (
    <File name={'common.yml'}>
      {`default:
  port: ${port(serverUrl)}

development:

test:

staging:

production:
`}
    </File>
  );
}