import { useRef, useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle"
import { Editor } from "@monaco-editor/react";
// import LanguageSelector from "./LanguageSelector";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "./constants";
// import Output from "./Output";

const template = `
/*
Complete the function solveMeFirst to compute the sum of two integers.

Example
a=7
b=3
Return 10

Function Description
Complete the solveMeFirst function in the editor below.
solveMeFirst has the following parameters:
int a: the first value
int b: the second value
Returns
- int: the sum of  and 
  useEffect(()=>{
    if(window){
     window.onblur = ()=> console.log('submiteddddddddddd')
    }
},[])
Constraints
1<=a,b<=1000

Sample Input
a = 2
b = 3
Sample Output
5

*/



function solveMeFirst(a, b) {
  // Hint: Type return a+b below   
}


function main() {
    var a = INPUT
    var b = INPUT

    var res = solveMeFirst(a, b);
    console.log(res);
}

main()

`

const input = [2, 3]

// let test =`{
// "list":[1,2,3,5],
// "num":5,
// "textnum":"5",
// "text":"adadd"
// }
// `


const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadings, setIsLoadings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds



  useEffect(() => {
    if (window) {
      window.onblur = () => console.log('submiteddddddddddd')
    }
    // const timer = setInterval(() => {
    //   setTimeLeft((prevTime) => {
    //     if (prevTime <= 0) {
    //       clearInterval(timer);
    //       // handleSubmit(); // Automatically submit when time is up
    //       return 0;
    //     }
    //     return prevTime - 1;
    //   });
    // }, 1000);

    // return () => clearInterval(timer);
  }, [])

  // test=JSON.parse(test)
  // console.log(test)


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
    let fvalue = value;
    for (let index = 0; index < input.length; index++) {
      fvalue = fvalue.replace("INPUT", input[index])
    }

    console.log(fvalue)
    axios.post("https://emkc.org/api/v2/piston/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: fvalue,
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
      <div className="d-flex justify-content-center vh-10 pt-2">
        {/* <h5 className="text-danger te">Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</h5> */}
        <button onClick={run} className="btn btn-success px-5 mx-2">
          {isLoading ?
            <div className="spinner-border" role="status"><span className="sr-only"></span></div>
            : <span>RUN</span>}
        </button>
        <button onClick={run} className="btn btn-outline-success px-5 mx-2">
          {isLoadings ?
            <div className="spinner-border" role="status"><span className="sr-only"></span></div>
            : <span>Submit</span>}
        </button>
      </div>
      <div className="d-flex justify-content-between pt-3">
        {/* <LanguageSelector language={language} onSelect={onSelect} /> */}
        <div className=" w-50 vh-75" >
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            theme="vs-dark"
            language="javascript"
            defaultValue={template}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </div>
        <div className=" w-50 vh-75 p-2 border text-light bg-black">
          {output
            ? output.map((line, i) => <p className="text-light mb-1" key={i}>{line}</p>)
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

