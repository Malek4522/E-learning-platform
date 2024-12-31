import React, { useState, useRef } from "react";
import "../styles/DiscussionForum.css";

const DiscussionForum = ({ courseId, lessonId, lessonTitle }) => {
  const [comment, setComment] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const commentsContainerRef = useRef(null);

  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/path/to/avatar.jpg",
        role: "Student",
      },
      content: "Great explanation! Can you clarify the setup process?",
      timestamp: "2 hours ago",
      lessonId: lessonId,
      likes: 5,
      replies: [
        {
          id: 2,
          user: {
            name: "Dr. Smith",
            avatar: "/path/to/teacher-avatar.jpg",
            role: "Teacher",
          },
          content: "Sure! You can find the setup guide on slide 3.",
          timestamp: "1 hour ago",
          likes: 2,
          replyingTo: "John Doe",
        },
      ],
    },
  ]);

  const handleLike = (commentId, isReply = false, parentId = null) => {
    const commentKey = isReply ? `${parentId}-${commentId}` : commentId;

    if (likedComments.has(commentKey)) {
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentKey);
        return newSet;
      });

      setComments((prevComments) =>
        prevComments.map((c) => {
          if (isReply) {
            if (c.id === parentId) {
              return {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === commentId ? { ...r, likes: r.likes - 1 } : r
                ),
              };
            }
            return c;
          }
          return c.id === commentId ? { ...c, likes: c.likes - 1 } : c;
        })
      );
    } else {
      setLikedComments((prev) => new Set(prev).add(commentKey));

      setComments((prevComments) =>
        prevComments.map((c) => {
          if (isReply) {
            if (c.id === parentId) {
              return {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === commentId ? { ...r, likes: r.likes + 1 } : r
                ),
              };
            }
            return c;
          }
          return c.id === commentId ? { ...c, likes: c.likes + 1 } : c;
        })
      );
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      user: {
        name: "Current Student",
        avatar: "/path/to/default-avatar.jpg",
        role: "Student",
      },
      content: comment,
      timestamp: "Just now",
      lessonId: lessonId,
      likes: 0,
      replyingTo: replyTo?.user.name,
      replies: [],
    };

    if (replyTo) {
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === replyTo.id
            ? { ...c, replies: [...c.replies, newComment] }
            : c
        )
      );
      setIsReplying(false);
      setReplyTo(null);
    } else {
      setComments((prevComments) => [...prevComments, newComment]);
    }

    setComment("");
  };

  const handleReply = (comment) => {
    setIsReplying(true);
    setReplyTo(comment);
    setShowComments(true);
    document.querySelector(".comment-input").focus();
  };

  const cancelReply = () => {
    setIsReplying(false);
    setReplyTo(null);
    setComment("");
  };

  return (
    <div className={`discussion-forum ${showComments ? "expanded" : ""}`}>
      <div className="discussion-header">
        <h3 className="discussion-title">Discussion - {lessonTitle}</h3>
        <button
          className="toggle-comments-btn"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
          <span className="comment-count">({comments.length})</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-container" ref={commentsContainerRef}>
          {comments.map((comment) => (
            <div key={comment.id} className="comment-thread">
              <div className="comment-main">
                <img src={comment.user.avatar} alt="" className="user-avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="user-name">{comment.user.name}</span>
                    <span className="user-role">{comment.user.role}</span>
                    <span className="timestamp">{comment.timestamp}</span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                  <div className="comment-actions">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`like-btn ${
                        likedComments.has(comment.id) ? "liked" : ""
                      }`}
                    >
                      <i className="fas fa-heart"></i> {comment.likes}
                    </button>
                    <button
                      onClick={() => handleReply(comment)}
                      className="reply-btn"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {comment.replies?.length > 0 && (
                <div className="replies-list">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="comment-reply">
                      <img
                        src={reply.user.avatar}
                        alt=""
                        className="user-avatar"
                      />
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="user-name">{reply.user.name}</span>
                          <span className="user-role">{reply.user.role}</span>
                          <span className="timestamp">{reply.timestamp}</span>
                        </div>
                        {reply.replyingTo && (
                          <span className="replying-to">
                            Replying to @{reply.replyingTo}
                          </span>
                        )}
                        <p className="comment-text">{reply.content}</p>
                        <div className="comment-actions">
                          <button
                            onClick={() =>
                              handleLike(reply.id, true, comment.id)
                            }
                            className={`like-btn ${
                              likedComments.has(`${comment.id}-${reply.id}`)
                                ? "liked"
                                : ""
                            }`}
                          >
                            <i className="fas fa-heart"></i> {reply.likes}
                          </button>
                          <button
                            onClick={() => handleReply(comment)}
                            className="reply-btn"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <form className="comment-form" onSubmit={handleSubmitComment}>
        {isReplying && (
          <div className="reply-indicator">
            <span>Replying to @{replyTo?.user.name}</span>
            <button
              type="button"
              onClick={cancelReply}
              className="cancel-reply"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        <div className="comment-input-wrapper">
          <img
            src="/path/to/default-avatar.jpg"
            alt=""
            className="user-avatar"
          />
          <textarea
            className="comment-input"
            placeholder={
              isReplying
                ? `Write your reply to ${replyTo?.user.name}...`
                : "Write your comment here..."
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="post-button">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiscussionForum;
