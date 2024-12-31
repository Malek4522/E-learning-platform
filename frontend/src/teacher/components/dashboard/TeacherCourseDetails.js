import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import "../../styles/dashboard/teacherCourseDetails.css";

function TeacherCourseDetails() {
  const { courseId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    // Load discussions from localStorage when lesson changes
    if (selectedLesson) {
      const savedDiscussions =
        JSON.parse(localStorage.getItem(`discussions-${selectedLesson.id}`)) ||
        [];
      setDiscussions(savedDiscussions);
    }
  }, [selectedLesson]);

  const handleReply = (commentId) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      text: replyText,
      author: "Teacher",
      timestamp: new Date().toISOString(),
      isTeacher: true,
    };

    const updatedDiscussions = discussions.map((discussion) => {
      if (discussion.id === commentId) {
        return {
          ...discussion,
          replies: [...(discussion.replies || []), newReply],
        };
      }
      return discussion;
    });

    setDiscussions(updatedDiscussions);
    localStorage.setItem(
      `discussions-${selectedLesson.id}`,
      JSON.stringify(updatedDiscussions)
    );
    setReplyText("");
  };

  return (
    <div className="teacher-app">
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <Sidebar />
          <main className="dashboard-content">
            {/* Existing course content */}

            {/* Discussion section */}
            {selectedLesson && (
              <div className="lesson-discussions">
                <h3>Lesson Discussions</h3>
                <div className="discussions-list">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="discussion-item">
                      <div className="discussion-main">
                        <div className="discussion-header">
                          <span className="author">{discussion.author}</span>
                          <span className="timestamp">
                            {new Date(discussion.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="discussion-text">{discussion.text}</p>
                      </div>

                      {/* Replies section */}
                      <div className="replies-section">
                        {discussion.replies?.map((reply) => (
                          <div
                            key={reply.id}
                            className={`reply-item ${
                              reply.isTeacher ? "teacher-reply" : ""
                            }`}
                          >
                            <div className="reply-header">
                              <span className="author">{reply.author}</span>
                              <span className="timestamp">
                                {new Date(reply.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="reply-text">{reply.text}</p>
                          </div>
                        ))}

                        {/* Reply input */}
                        <div className="reply-input">
                          <textarea
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <button onClick={() => handleReply(discussion.id)}>
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default TeacherCourseDetails;
