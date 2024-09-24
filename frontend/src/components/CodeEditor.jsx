import { useRef, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle"
import { Editor } from "@monaco-editor/react";
// import LanguageSelector from "./LanguageSelector";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "./constants";
// import Output from "./Output";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(()=>{
    if(window){
     window.onblur = ()=> console.log('submiteddddddddddd')
    }
},[])


  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  // const onSelect = (language) => {
  //   setLanguage(language);
  //   setValue(CODE_SNIPPETS[language]);
  // };



  function run() {
    setIsLoading(true);
    axios.post("https://emkc.org/api/v2/piston/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: value,
        },
      ],
    })
      .then(res => {
        console.log(res);
        setOutput(res.data.run.output.split("\n"));
        console.log(res.data.run.output.split("\n"))
        setIsLoading(false);
      }).catch(error => {
        console.log(error);
        setIsLoading(false);
      })
  }


  // function run() {
  //   setIsLoading(true);
  //   axios.get("https://emkc.org/api/v2/piston/runtimes")
  //     .then(res => {
  //       console.log(res);
  //       setIsLoading(false);
  //     }).catch(error => {
  //       console.log(error);
  //       setIsLoading(false);
  //     })
  // }


  return (
    <div className="bg-dark vh-100">
      <div className="d-flex justify-content-center vh-10">
        <button onClick={run} className="btn btn-success px-5">
          {isLoading ?
            <div class="spinner-border" role="status"><span class="sr-only"></span></div>
            : <span>RUN</span>}
        </button>
      </div>
      <div className="d-flex justify-content-between pt-3">
        {/* <LanguageSelector language={language} onSelect={onSelect} /> */}
        <div className="container w-50 vh-75" >
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            theme="vs-dark"
            language="javascript"
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </div>
        <div className="container w-50 vh-75 border text-light bg-black">
          {output
            ? output.map((line, i) => <p key={i}>{line}</p>)
            : 'Click "Run" to see the output here'}
        </div>

      </div>
      {/* <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div> */}
    </div>
  );
};
export default CodeEditor;