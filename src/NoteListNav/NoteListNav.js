import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import { countNotesForFolder } from '../notes-helpers'
import './NoteListNav.css'
import config from '../config'

export default class NoteListNav extends React.Component {

  static contextType = ApiContext;

  handleClickDelete = (folderId) => {
    fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(() => {
        this.context.deleteFolder(folderId);
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { folders = [], notes = [] } = this.context
    return (
      <div className='NoteListNav'>
        <ul className='NoteListNav__list'>
          {folders.map(folder =>
            <li key={folder.id}>
              <NavLink
                className='NoteListNav__folder-link'
                to={`/folder/${folder.id}`}
              >
                <span className='NoteListNav__num-notes'>
                  {countNotesForFolder(notes, folder.id)}
                </span>
                {folder.name}
              </NavLink>
              <button
                className='Note__delete'
                type='button'
                onClick={() => this.handleClickDelete(folder.id)}
              >
                <FontAwesomeIcon icon='trash-alt' />
                {' '}
                remove
              </button>
            </li>
          )}
        </ul>
        <div className='NoteListNav__button-wrapper'>
          <CircleButton
            tag='link'
            to='/add-folder'
            type='button'
            className='NoteListNav__add-folder-button'
          >
            <>
              <FontAwesomeIcon icon='plus' />
              <br />
              Folder
            </>
          </CircleButton>
        </div>
      </div>
    )
  }
}
