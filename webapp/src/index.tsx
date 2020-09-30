// To see this in action, run this in a terminal:
//      gp preview $(gp url 8000)

import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

import 'semantic-ui-css/semantic.min.css';
import './styles.css';

import { NewEntry } from './NewEntry'
import { EntryComponent } from './Entry'

import actions from './actions'

const rpc = new JsonRpc(''); // nodeos and web server are on same port
const privateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

export interface Entry {
    uuid: string,
    account_name: string,
    task: string,
    checked: boolean,
}

const App: React.FC = () => {
    const [api, setApi] = useState<Api>();
    const [error, setError] = useState<string>('');
    const [list, setList] = useState<any>();

    useEffect(() => {
        setApi(new Api({ rpc, signatureProvider: new JsSignatureProvider([privateKey]) }));
        getList();
    }, []);

    const getList = async () => {
        setError('');
        if (api === undefined) return setError('Unexpected error: Api object is not set.');

        try {
            const transactionResult = await actions.getbyaccname(api);
            setList(transactionResult.processed.action_traces[0].return_value_data);
        } catch (e) {
            setError(e);
        }
    }

    const upsert = async (entry: Entry) => {
        setError('');
        if (api === undefined) return setError('Unexpected error: Api object is not set.');
        
        try {
            await actions.upsert(api, entry);
            await getList();
        } catch (e) {
            setError(e);
        }
    }

    const del = async (uuid: string) => {
        setError('');
        if (api === undefined) return setError('Unexpected error: Api object is not set.');
        
        try {
            await actions.del(api, uuid);
            setList(list.filter((entry: Entry) => entry.uuid !== uuid));
        } catch (e) {
            setError(e);
        }
    }

    return (
        <div className='ui text container'>
            <h1 className='ui header centered'>Sample KV Tables Application</h1>
            <NewEntry upsert={upsert} />
            <div className="ui raised segments">
                {list && list.map((entry: Entry) => <EntryComponent entry={entry} key={entry.uuid} upsert={upsert} del={del} />)}
                {(!list || list.length === 0) && <div className="ui segment center aligned">No Tasks To Display, Create A New Task!</div>}
            </div>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('sample')
);
