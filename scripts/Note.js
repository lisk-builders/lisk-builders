import React from 'react';

const Note = ({ note, centered, action}) =>
    <section className={`empty col-12 text-${centered ? "center" : "justify"}`}>
        {note.title && <h4 className="empty-title">{note.title}</h4>}
        {note.p.map((text, i) =>
            <p className="empty-subtitle" key={i}>{text}</p>,
        )}
        {action &&
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
