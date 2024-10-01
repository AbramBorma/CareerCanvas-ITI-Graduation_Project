import React, { useState } from 'react';
import Editor from '@monaco-editor/react'; // Monaco editor
import '../static/styles/page-landing.css'; // Merged CSS file

const PageLandingWithEditor = () => {
  const [code, setCode] = useState(`console.log("Hello, CareerCanvas!");`);
  const [output, setOutput] = useState('');

  // Function to run the code
  const runCode = () => {
    try {
      const log = [];
      const customConsole = {
        log: (message) => log.push(message),
      };

      // Run the user's code inside an isolated function
      new Function('console', code)(customConsole);

      setOutput(log.join('\n')); // Set output
    } catch (err) {
      setOutput(err.message); // Catch and display any errors
    }
  };

  return (
    <div className="page-landing-with-editor">
      {/* Page Landing Section */}
      <div className="page-landing">
        <div className="intro">
          <h1>Welcome to CareerCanvas</h1>
          <p className="intro-paragraph">
              Welcome to Career Canvas!
              This platform empowers organizations to streamline student management through supervisors, who guide and oversee their progress. Supervisors can manage students, track their performance, and assign exams. Students can build personalized portfolios, take skill-based exams, and showcase their achievements. Ready to elevate your organization’s academic journey? Let’s get started and create your canvas today!          </p>
          <a href="#get-started" className="cta-button">Get Started</a>
        </div>
      </div>
      
      <p className='code-paragraph'>Try our Oustanding coding Environment and RUN the Code Now!</p>
      {/* Code Editor Section */}
      <div className="code-editor-container">
        <div className="editor-output">
            <div className="editor-container">
            <Editor
                defaultLanguage="javascript"
                value={code}
                onChange={(newCode) => setCode(newCode)}
                theme="vs-dark"
            />
            </div>
            <div className="output-container">
            <h3>Output:</h3>
            <pre>{output}</pre>
            </div>
        </div>
        <button className="run-code-btn" onClick={runCode}>
            Run Code
        </button>
      </div>
    </div>
  );
};

export default PageLandingWithEditor;
