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
import { Error } from './Error'

import actions from './actions'

const rpc = new JsonRpc(process.env.NODEOS_ENDPOINT || '');
const privateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

export interface Entry {
    uuid: string,
    account_name: string,
    task: string,
    checked: boolean,
    created: number,
}

const App: React.FC = () => {
    const [api] = useState<Api>(new Api({ rpc, signatureProvider: new JsSignatureProvider([privateKey]) }));
    const [error, setError] = useState<string>('');
    const [list, setList] = useState<any>();

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setError('');
        if (api === undefined) return setError('Unexpected error: Api object is not set.');

        try {
            const transactionResult = await actions.getbyaccname(api);
            const entries = transactionResult.processed.action_traces[0].return_value_data.map((entry: any) => {
                return {
                    uuid: entry.uuid,
                    account_name: entry.account_name.field_1,
                    task: entry.task.field_1,
                    checked: entry.checked.field_1,
                    created: entry.created.field_1,
                };
            }).sort((a: Entry, b: Entry) => {
                if (a.created < b.created) return -1;
                if (a.created > b.created) return 1;
                return 0;
            });
            setList(entries);
        } catch (e) {
            setError(e.message);
        }
    }

    const upsert = async (entry: Entry) => {
        setError('');
        if (api === undefined) return setError('Unexpected error: Api object is not set.');
        
        try {
            await actions.upsert(api, entry);
            await getList();
        } catch (e) {
            setError(e.message);
        }
    }

    const del = async (uuid: string) => {
        setError('');
        if (api === undefined) return setError('Unexpected error: Api object is not set.');
        
        try {
            await actions.del(api, uuid);
            setList(list.filter((entry: Entry) => entry.uuid !== uuid));
        } catch (e) {
            setError(e.message);
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
            {error && <Error error={error} />}
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('sample')
);
