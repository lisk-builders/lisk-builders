import React from 'react';

const Note = note =>
    <section className="empty text-justify">
        {note.title && <h4 className="empty-title">{note.title}</h4>}
        {note.p.map((text, i) =>
            <p className="empty-subtitle" key={i}>{text}</p>,
        )}
        {note.action &&
            <div className="empty-action">
                <a
                    className="btn btn-primary"
                    target="_blank"
                    href="https://lisk.chat/direct/5an1ty">
                    Send a message
                </a>
            </div>}
    </section>;

export default Note;
