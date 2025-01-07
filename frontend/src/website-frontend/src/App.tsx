import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import axios from 'axios';

import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';


const App: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [school, setSchool] = useState<string>('');

    const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
          e.preventDefault();
          const textarea = e.target as HTMLTextAreaElement;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;

          const spaces = `\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;
  

          // Set textarea value to: text before caret + tab + text after caret
          setMarkdown(markdown.substring(0, start) + spaces + markdown.substring(end));

          // Put caret at right position again
          setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = start + 1;
          }, 0);
      }
  };

    const saveNote = async () => {
        try {
            const response = await axios.post(`http://localhost:5003/api/notes/${school}/${subject}/${title}`, {
                school,
                subject,
                title,
                content: markdown,
            });
            alert('Note saved successfully!');
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save the note.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            <div style={{ padding: '1rem' }}>
                <input placeholder="School" value={school} onChange={(e) => setSchool(e.target.value)} />
                <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button onClick={saveNote}>Save Note</button>
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
                <textarea
                    style={{ width: '50%', padding: '1rem' }}
                    value={markdown}
                    onChange={handleMarkdownChange}
                    onKeyDown={handleKeyDown}
                />
                <div style={{ width: '50%', padding: '1rem', borderLeft: '1px solid #ccc', overflow: 'auto', wordWrap: 'break-word' }}>
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeHighlight]}
                    >
                        {markdown}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default App;
