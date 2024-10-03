"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.studentPortfolio = exports.hackerrank = exports.leetCode = exports.deleteStudent = exports.approveStudent = exports.getStudents = exports.deleteSupervisor = exports.approveSupervisor = exports.getSupervisors = exports.submitExam = exports.getQuestions = exports["default"] = exports.github = void 0;

var _api = _interopRequireDefault(require("../utils/api"));

var _useAxios = _interopRequireDefault(require("../utils/useAxios"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var API_URL = "http://127.0.0.1:8000"; // ../services/api.js

var github = function github(userId) {
  var response, data;
  return regeneratorRuntime.async(function github$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("/portfolio/student-github/".concat(userId, "/"), {
            headers: {
              'Authorization': "Bearer ".concat(localStorage.getItem('access_token'))
            }
          }));

        case 2:
          response = _context.sent;

          if (response.ok) {
            _context.next = 5;
            break;
          }

          throw new Error('Failed to fetch GitHub username');

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          data = _context.sent;
          return _context.abrupt("return", data);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.github = github;

var getAuthToken = function getAuthToken() {
  var authTokens = localStorage.getItem('authTokens');

  if (authTokens) {
    var tokens = JSON.parse(authTokens);
    console.log("Retrieved Tokens:", tokens); // Log the entire token object

    return tokens.access; // Return the access token
  }

  console.warn("No tokens found in localStorage.");
  return null; // Return null if no tokens are found
};

var useApi = function useApi(username) {
  var axiosInstance, fetchGitHubData, fetchHackerRankData, getSupervisors, approveSupervisor;
  return regeneratorRuntime.async(function useApi$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          axiosInstance = (0, _useAxios["default"])();

          fetchGitHubData = function fetchGitHubData(username) {
            var response;
            return regeneratorRuntime.async(function fetchGitHubData$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    _context2.next = 3;
                    return regeneratorRuntime.awrap(axiosInstance.get("/api/github/".concat(username, "/")));

                  case 3:
                    response = _context2.sent;
                    return _context2.abrupt("return", response.data);

                  case 7:
                    _context2.prev = 7;
                    _context2.t0 = _context2["catch"](0);
                    console.error("Error fetching GitHub data", _context2.t0);
                    throw _context2.t0;

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            }, null, null, [[0, 7]]);
          };

          fetchHackerRankData = function fetchHackerRankData(username) {
            var response;
            return regeneratorRuntime.async(function fetchHackerRankData$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.prev = 0;
                    _context3.next = 3;
                    return regeneratorRuntime.awrap(axiosInstance.get("/api/hackerrank/".concat(username, "/")));

                  case 3:
                    response = _context3.sent;
                    return _context3.abrupt("return", response.data);

                  case 7:
                    _context3.prev = 7;
                    _context3.t0 = _context3["catch"](0);
                    console.error("Error fetching HackerRank data", _context3.t0);
                    throw _context3.t0;

                  case 11:
                  case "end":
                    return _context3.stop();
                }
              }
            }, null, null, [[0, 7]]);
          }; // Users APIs:
          // Fetch all supervisors


          getSupervisors = function getSupervisors() {
            var response;
            return regeneratorRuntime.async(function getSupervisors$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.prev = 0;
                    _context4.next = 3;
                    return regeneratorRuntime.awrap(axiosInstance.get('/users/supervisors/'));

                  case 3:
                    response = _context4.sent;
                    return _context4.abrupt("return", response.data);

                  case 7:
                    _context4.prev = 7;
                    _context4.t0 = _context4["catch"](0);
                    console.error("Error fetching supervisors", _context4.t0);
                    throw _context4.t0;

                  case 11:
                  case "end":
                    return _context4.stop();
                }
              }
            }, null, null, [[0, 7]]);
          }; // Approve a supervisor


          approveSupervisor = function approveSupervisor(id) {
            var response;
            return regeneratorRuntime.async(function approveSupervisor$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.prev = 0;
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(axiosInstance.post("/users/approve-supervisor/".concat(id, "/")));

                  case 3:
                    response = _context5.sent;
                    return _context5.abrupt("return", response.data);

                  case 7:
                    _context5.prev = 7;
                    _context5.t0 = _context5["catch"](0);
                    console.error("Error approving supervisor", _context5.t0);
                    throw _context5.t0;

                  case 11:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[0, 7]]);
          };

          return _context6.abrupt("return", {
            fetchGitHubData: fetchGitHubData,
            fetchHackerRankData: fetchHackerRankData,
            getSupervisors: getSupervisors,
            approveSupervisor: approveSupervisor
          });

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var _default = useApi; // export const getQuestions = async (subject,level) => {
//     return await api.get(`${API_URL}/exams/fetchQuestions/${subject}/${level}`);
//   };
//   export const submitExam = async (answers) => {
//     return await api.post(`${API_URL}/exams/submit/`,answers);
//   };

exports["default"] = _default;

var getQuestions = function getQuestions(subject, level) {
  var token, response;
  return regeneratorRuntime.async(function getQuestions$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          token = getAuthToken(); // Ensure this retrieves the correct token

          console.log("Using Access Token for Questions Request:", token); // Log token to verify

          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(API_URL, "/exams/fetchQuestions/").concat(subject, "/").concat(level), {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token correctly

            }
          }));

        case 5:
          response = _context7.sent;
          return _context7.abrupt("return", response.data);

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](2);
          console.error("Error fetching questions:", _context7.t0);
          throw _context7.t0;

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

exports.getQuestions = getQuestions;

var submitExam = function submitExam(answers) {
  var token, response;
  return regeneratorRuntime.async(function submitExam$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          token = getAuthToken(); // Ensure this retrieves the correct token

          console.log("Using Access Token for Submit Exam Request:", token); // Log token to verify

          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API_URL, "/exams/submit/"), answers, {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token correctly

            }
          }));

        case 5:
          response = _context8.sent;
          return _context8.abrupt("return", response.data);

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](2);
          console.error("Error submitting exam:", _context8.t0);
          throw _context8.t0;

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; // Users APIs:
// Fetch all supervisors


exports.submitExam = submitExam;

var getSupervisors = function getSupervisors() {
  var token, response;
  return regeneratorRuntime.async(function getSupervisors$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          token = getAuthToken(); // Ensure this retrieves the correct token

          console.log("Using Access Token for Supervisors Request:", token); // Log token to verify

          _context9.prev = 2;
          _context9.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(API_URL, "/users/supervisors/"), {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token correctly

            }
          }));

        case 5:
          response = _context9.sent;
          return _context9.abrupt("return", response.data);

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](2);
          console.error("Error fetching supervisors:", _context9.t0);
          throw _context9.t0;

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; // Approve a supervisor


exports.getSupervisors = getSupervisors;

var approveSupervisor = function approveSupervisor(id) {
  var token, response;
  return regeneratorRuntime.async(function approveSupervisor$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          token = getAuthToken(); // Retrieve the token

          _context10.prev = 1;
          _context10.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API_URL, "/users/approve-supervisor/").concat(id, "/"), {}, {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token in the header

            }
          }));

        case 4:
          response = _context10.sent;
          return _context10.abrupt("return", response.data);

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](1);
          console.error("Error approving supervisor", _context10.t0);
          throw _context10.t0;

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.approveSupervisor = approveSupervisor;

var deleteSupervisor = function deleteSupervisor(id) {
  var token, response;
  return regeneratorRuntime.async(function deleteSupervisor$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          token = getAuthToken(); // Retrieve the token

          _context11.prev = 1;
          _context11.next = 4;
          return regeneratorRuntime.awrap(_axios["default"]["delete"]("".concat(API_URL, "/users/delete_supervisor/").concat(id, "/"), {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token in the header

            }
          }));

        case 4:
          response = _context11.sent;
          return _context11.abrupt("return", response.data);

        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](1);
          console.error("Error deleting supervisor", _context11.t0);
          throw _context11.t0;

        case 12:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.deleteSupervisor = deleteSupervisor;

var getStudents = function getStudents() {
  var token, response;
  return regeneratorRuntime.async(function getStudents$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          token = getAuthToken(); // Ensure this retrieves the correct token

          console.log("Using Access Token for Supervisors Request:", token); // Log token to verify

          _context12.prev = 2;
          _context12.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(API_URL, "/users/students/"), {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token correctly

            }
          }));

        case 5:
          response = _context12.sent;
          return _context12.abrupt("return", response.data);

        case 9:
          _context12.prev = 9;
          _context12.t0 = _context12["catch"](2);
          console.error("Error fetching students:", _context12.t0);
          throw _context12.t0;

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

exports.getStudents = getStudents;

var approveStudent = function approveStudent(id) {
  var token, response;
  return regeneratorRuntime.async(function approveStudent$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          token = getAuthToken(); // Retrieve the token

          _context13.prev = 1;
          _context13.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API_URL, "/users/approve-student/").concat(id, "/"), {}, {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token in the header

            }
          }));

        case 4:
          response = _context13.sent;
          return _context13.abrupt("return", response.data);

        case 8:
          _context13.prev = 8;
          _context13.t0 = _context13["catch"](1);
          console.error("Error approving student", _context13.t0);
          throw _context13.t0;

        case 12:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.approveStudent = approveStudent;

var deleteStudent = function deleteStudent(id) {
  var token, response;
  return regeneratorRuntime.async(function deleteStudent$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          token = getAuthToken(); // Retrieve the token

          _context14.prev = 1;
          _context14.next = 4;
          return regeneratorRuntime.awrap(_axios["default"]["delete"]("".concat(API_URL, "/users/delete-student/").concat(id, "/"), {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token in the header

            }
          }));

        case 4:
          response = _context14.sent;
          return _context14.abrupt("return", response.data);

        case 8:
          _context14.prev = 8;
          _context14.t0 = _context14["catch"](1);
          console.error("Error deleting student", _context14.t0);
          throw _context14.t0;

        case 12:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.deleteStudent = deleteStudent;

var leetCode = function leetCode(id) {
  var token, response;
  return regeneratorRuntime.async(function leetCode$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          token = getAuthToken(); // Retrieve the token

          _context15.prev = 1;
          _context15.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(API_URL, "/portfolio/student-leetcode/").concat(id, "/"), {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token in the header

            }
          }));

        case 4:
          response = _context15.sent;
          return _context15.abrupt("return", response.data);

        case 8:
          _context15.prev = 8;
          _context15.t0 = _context15["catch"](1);
          console.error("Error fetching student LeetCode Statistics", _context15.t0);
          throw _context15.t0;

        case 12:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.leetCode = leetCode;

var hackerrank = function hackerrank(id) {
  var token, response;
  return regeneratorRuntime.async(function hackerrank$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          token = getAuthToken(); // Retrieve the token

          _context16.prev = 1;
          _context16.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(API_URL, "/portfolio/student-hackerrank/").concat(id, "/"), {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token in the header

            }
          }));

        case 4:
          response = _context16.sent;
          return _context16.abrupt("return", response.data);

        case 8:
          _context16.prev = 8;
          _context16.t0 = _context16["catch"](1);
          console.error("Error fetching student HackerRank Statistics", _context16.t0);
          throw _context16.t0;

        case 12:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.hackerrank = hackerrank;

var studentPortfolio = function studentPortfolio(id) {
  var token, response;
  return regeneratorRuntime.async(function studentPortfolio$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          token = getAuthToken(); // Retrieve the token

          _context17.prev = 1;
          _context17.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(API_URL, "/portfolio/student-portfolio/").concat(id, "/"), {
            headers: {
              Authorization: "Bearer ".concat(token) // Include the token in the header

            }
          }));

        case 4:
          response = _context17.sent;
          return _context17.abrupt("return", response.data);

        case 8:
          _context17.prev = 8;
          _context17.t0 = _context17["catch"](1);
          console.error("Error fetching student portfolio", _context17.t0);
          throw _context17.t0;

        case 12:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.studentPortfolio = studentPortfolio;