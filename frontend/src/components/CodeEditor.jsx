import { useRef, useState, useEffect } from "react";
import { useParams,useLocation ,useNavigate} from 'react-router-dom';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle"
import Spinner from './Spinner.js';
import { Editor } from "@monaco-editor/react";
import { getQuestions,submitExam } from '../services/api';
// import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "./constants";

const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  bash: "5.2.0",
};




const CodeEditor = () => {
  const editorRef = useRef();
  const { subject } = useParams();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadings, setIsLoadings] = useState(false);
  const [questiondata,setQuestiondata]=useState();
  const [question, setQuestion] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
  const [rerender, setRerender] = useState(false)
  const [runcase, setRuncase] = useState([]);
  const [runexpect, setRunexpect] = useState([]);
  const [runstate, setRunstate] = useState();
  const [runerror, setRunerorr] = useState(false);
  const [cheat,setCheat] = useState(false);
  const location = useLocation();
  const { userAnswers } = location.state || {};
  const navigate = useNavigate();







  useEffect(() => {
    try {
      const fetchedQuestion = async () => {
        setIsLoading(true)
        const res = await getQuestions(subject, "coding")
        console.log(res)
        const data = res
        const randomIndex = Math.floor(Math.random() * data.length);
        // const randomIndex =0
        setQuestiondata(data[randomIndex])
        setQuestion(data[randomIndex].question_text);
        const fioption = data[randomIndex].options[0]
        setRunexpect(JSON.parse(fioption).expected)
        setRuncase(JSON.parse(fioption).input)
        setIsLoading(false)
        // setTimeout(()=>console.log("["+runcase+"]"),1)
        console.log(userAnswers)

      }
      fetchedQuestion()
    } catch (error) {
      console.error('Error fetching exam:', error);
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
          
          if (LANGUAGE_VERSIONS[subject] != undefined) {
            setLanguage(subject)
            
          }

        }, [])



        function Cheating (){
          console.log(cheat)
          if (cheat){
            submit();
          }else{
              setCheat(true);
              alert('Warning: No Cheating!');
          }
      }
      
          useEffect(() => {
              if (window) {
                  window.onblur = () => Cheating();
                }
      
                return () => {window.onblur = null;  };
          }, [cheat]);
      

  // test=JSON.parse(test)
  // console.log(test)


  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };


  function run(inp,outp) {
    setIsLoading(true);
    let fvalue = value;
    // for (let index = 0; index < runcase.length; index++) {

    // fvalue = fvalue.replace("INPUT", runcase)

    if (typeof (inp) == "object")
      fvalue = fvalue.replace("INPUT", JSON.stringify(inp))
    else
      fvalue = fvalue.replace("INPUT", inp)

    // }

    // console.log(fvalue)
    
    return axios.post("https://emkc.org/api/v2/piston/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      // stdin:inp,
      files: [
        {
          content: fvalue,
        },
      ],
    })
      .then(res => {
        console.log(res);
        const newOutput = res.data.run.output.split("\n");
        setOutput(newOutput);
        // console.log(eval(newOutput[0]))
        setIsLoading(false);
        // console.log(outp)
        // const outtest= output[0].replace(/\s/g, '');
        // console.log(newOutput.length)
        if (newOutput.length >= 1) {
            if(typeof(outp) != "string"){
            if (eval(newOutput[0]).toString() === outp.toString()) {if(inp == runcase){setRunstate(true);}return 1}
            else {if(inp == runcase){setRunstate(false);} return 0}
            }else{
              if (newOutput[0].toString() === outp.toString()) {if(inp == runcase){setRunstate(true);}return 1}
              else {if(inp == runcase){setRunstate(false);} return 0}
            }
          
        }
        return 0
        
      }).catch(error => {
        console.log(error);
        // setRunerorr(true)
        setRunstate(false)
        setIsLoading(false);
        return 0

      })

  }


  










 async function submit() {
    setIsLoadings(true);
  
    const options = questiondata.options;
    let score=0
    run(runcase,runexpect).then(result => score+=result)
    console.log(score)
    
    for (let i = 1; i <= 3; i++) {
      const expected = JSON.parse(options[i]).expected;
      const input = JSON.parse(options[i]).input;
      await new Promise(resolve => {
        // setRunexpect(prev => expected);
        // setRuncase(prev => input);
        setTimeout(() => {
          run(input,expected).then(result => score+=result) 
          resolve();
        }, 1000);
      });
    }
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    console.log(score)


    const newanswers = {
      ...userAnswers.answers,
      [questiondata.id]: score,
  };
  userAnswers.answers=newanswers

  try {
    console.log(userAnswers);
    const response=await submitExam(JSON.stringify(userAnswers))
    console.log(response)
    const result = await response;
    alert(`Exam submitted! Your score: ${result.score}`);
    navigate(`/exams`);
} catch (error) {
    console.error('Error submitting exam:', error);
    setIsLoadings(false);
}
  
    setIsLoadings(false);
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
        <button onClick={()=>run(runcase,runexpect)} className="btn btn-success px-5 mx-2">
          {isLoading ?
            <div className="spinner-border" role="status"><span className="sr-only"></span></div>
            : <span>RUN</span>}
        </button>
        <button onClick={submit} className="btn btn-outline-success px-5 mx-2">
          {isLoadings ?
            <div className="spinner-border" role="status"><span className="sr-only"></span></div>
            : <span>Submit</span>}
        </button>
      </div>
      {isLoading ?
        (<Spinner />)
        : (<div className="d-flex justify-content-between pt-3">
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
              language={language}
              defaultValue={question}
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

        </div>)}
      {/* {runerror?
          (<div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Holy guacamole!</strong> You should check in on some of those fields below.
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>): */}
      {runstate? 
      (<div className="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Well done!</strong> You passed the fist test case.
        {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
      </div>):<></>}
    </div>
  );
};
export default CodeEditor;