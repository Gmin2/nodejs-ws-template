import { File } from '@asyncapi/generator-react-sdk';

export default function READMEFile({ asyncapi }) {
    return <File name={'README.md'}>
        {`# ${asyncapi.info().title()}
        
        {{ asyncapi.info().description() | safe }}
         `}
    </File>;
}