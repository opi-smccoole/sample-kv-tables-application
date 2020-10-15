import React, { useState } from 'react';
import { Entry } from '../'

interface EntryProps {
    entry: Entry,
    upsert: (entry: Entry) => Promise<void>
    del: (uuid: string) => Promise<void>
}

export const EntryComponent: React.FC<EntryProps> = ({ entry, upsert, del }: EntryProps) => {
    const [mutableEntry, setMutableEntry] = useState<Entry>({...entry})
    const [editing, setEditing] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return setMutableEntry({...mutableEntry, task: ''});
        setMutableEntry({...mutableEntry, task: e.target.value});
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMutableEntry({...mutableEntry, checked: !mutableEntry.checked});
        update();
    }

    const handleResetEditing = (e: React.MouseEvent<any>) => {
        setMutableEntry(entry);
        setEditing(!editing);
    }

    const save = async () => {
        await update();
        setEditing(!editing);
    }

    const update = async () => {
        await upsert(mutableEntry);
    }

    const deleteEntry = async () => {
        await del(entry.uuid);
    }

    return (
        <div className="ui segment">
            <div className="ui grid middle aligned">
                <div className='one wide column'>
                    <input type="checkbox" checked={mutableEntry.checked} onChange={handleCheckboxChange} />
                </div>
                <div className='fifteen wide column'>
                    { !editing && <div className="ui fluid action input">
                        <input
                            className={ mutableEntry.checked ? 'ui input strikethrough' : 'ui input'}
                            type='text'
                            name='task'
                            value={mutableEntry.task}
                            readOnly={true}
                            onClick={(e) => setEditing(!editing)}>
                        </input>
                        <button className="ui button" onClick={e => deleteEntry()}><i className="trash icon"></i></button>
                    </div> }
                    { editing && <div className="ui fluid action input">
                        <input
                            className='ui input'
                            type='text'
                            name='task'
                            value={mutableEntry.task}
                            onChange={handleChange}>
                        </input>
                        <div className="ui icon buttons">
                            <button className="ui button" onClick={e => save()}><i className="check icon"></i></button>
                            <button className="ui button" onClick={handleResetEditing}><i className="times icon"></i></button>
                        </div>
                    </div> }
                </div>
            </div>
        </div>
    );
}
