"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "lambanog-community-board-v1";
const MAX_IMAGE_SIZE = 300 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEO_HOSTS = new Set(["youtube.com", "www.youtube.com", "youtu.be", "vimeo.com", "www.vimeo.com"]);

function readSavedBoard() {
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (!value) return { reviews: [], stories: [] };
  const parsed = JSON.parse(value);
  if (!parsed || !Array.isArray(parsed.reviews) || !Array.isArray(parsed.stories)) {
    throw new Error("Saved community content has an unexpected format.");
  }
  return parsed;
}

function fileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("The selected image could not be read."));
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.readAsDataURL(file);
  });
}

function safeVideoUrl(value) {
  if (!value.trim()) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" && VIDEO_HOSTS.has(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

export default function CommunityBoard() {
  const [reviews, setReviews] = useState([]);
  const [stories, setStories] = useState([]);
  const [ready, setReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [storyMessage, setStoryMessage] = useState("");

  useEffect(() => {
    try {
      const saved = readSavedBoard();
      setReviews(saved.reviews);
      setStories(saved.stories);
    } catch (reason) {
      setError(`Could not read saved contributions: ${reason.message}`);
      setLoadFailed(true);
    } finally {
      setReady(true);
    }
  }, []);

  function persist(nextReviews, nextStories) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ reviews: nextReviews, stories: nextStories }));
      setReviews(nextReviews);
      setStories(nextStories);
      setError("");
      return true;
    } catch (reason) {
      setError(`Could not save this contribution in this browser. ${reason.message || "Browser storage may be full or unavailable."}`);
      return false;
    }
  }

  function submitReview(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const review = {
      id: Date.now(),
      name: String(data.get("review-name")).trim() || "Visitor",
      rating: Number(data.get("rating")),
      text: String(data.get("review-text")).trim(),
      date: new Date().toLocaleDateString(),
    };
    if (persist([...reviews, review], stories)) {
      event.currentTarget.reset();
      setReviewMessage("Your review is saved on this device.");
    }
  }

  async function submitStory(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("story-image");
    const video = safeVideoUrl(String(data.get("story-video")));
    if (video === null) {
      setError("Enter a secure YouTube or Vimeo link, or leave the video field blank.");
      return;
    }
    if (file instanceof File && file.size > MAX_IMAGE_SIZE) {
      setError("The image must be 300 KB or smaller so it can fit in browser-only storage.");
      return;
    }
    if (file instanceof File && file.size && !IMAGE_TYPES.has(file.type)) {
      setError("Choose a JPEG, PNG, WebP or GIF image, or add a secure YouTube or Vimeo link.");
      return;
    }

    try {
      const image = file instanceof File && file.size ? await fileAsDataUrl(file) : "";
      const story = {
        id: Date.now(),
        name: String(data.get("story-name")).trim() || "Community member",
        category: String(data.get("story-category")),
        title: String(data.get("story-title")).trim(),
        text: String(data.get("story-text")).trim(),
        image,
        video,
        date: new Date().toLocaleDateString(),
      };
      if (persist(reviews, [...stories, story])) {
        form.reset();
        setStoryMessage("Your contribution is saved on this device.");
      }
    } catch (reason) {
      setError(reason.message);
    }
  }

  function clearBoard() {
    if (!window.confirm("Remove all reviews and stories saved on this device? This cannot be undone.")) return;
    if (loadFailed) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        setReviews([]);
        setStories([]);
        setLoadFailed(false);
        setError("");
        setReviewMessage("");
        setStoryMessage("");
      } catch (reason) {
        setError(`Could not clear saved contributions. ${reason.message || "Browser storage is unavailable."}`);
      }
      return;
    }
    persist([], []);
    setReviewMessage("");
    setStoryMessage("");
  }

  return (
    <div className="feature-stack">
      <section className="feature-panel community-notice">
        <p className="eyebrow">Digital community</p>
        <h2>Share a story or visitor review</h2>
        <p>Contributions are saved only in this browser on this device. They are not uploaded, shared with other visitors, or reviewed by a moderator. Avoid including private contact details. A future public gallery requires a shared service and moderation.</p>
      </section>

      {error && <p className="form-message form-error" role="alert">{error}</p>}

      <section className="feature-panel" aria-labelledby="visitor-reviews-title">
        <h2 id="visitor-reviews-title">Visitor reviews</h2>
        <form className="feature-form" onSubmit={submitReview}>
          <label>Display name (optional)<input name="review-name" maxLength="40" /></label>
          <label>Rating
            <select name="rating" required defaultValue="5">
              <option value="5">5 — Excellent</option><option value="4">4 — Very good</option>
              <option value="3">3 — Good</option><option value="2">2 — Fair</option><option value="1">1 — Poor</option>
            </select>
          </label>
          <label>Your review<textarea name="review-text" required minLength="5" maxLength="500" rows="4" /></label>
          <button className="feature-button feature-button-primary" type="submit" disabled={!ready || loadFailed}>Save review on this device</button>
          {reviewMessage && <p className="form-message" role="status">{reviewMessage}</p>}
        </form>
        <div className="community-list">
          <h3>Reviews saved here ({reviews.length})</h3>
          {reviews.length === 0 ? <p className="empty-state">No reviews saved in this browser yet.</p> : reviews.map((review) => (
            <article className="community-card" key={review.id}>
              <p className="community-rating" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
              <p>{review.text}</p><small>{review.name} · {review.date}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-panel" aria-labelledby="community-stories-title">
        <h2 id="community-stories-title">Stories, profiles and visitor gallery</h2>
        <p className="feature-intro">Add a community story, producer profile, or visitor experience. Include only information and media you have permission to share.</p>
        <form className="feature-form" onSubmit={submitStory}>
          <label>Contribution type
            <select name="story-category" defaultValue="Community story">
              <option>Community story</option><option>Producer profile</option><option>Visitor experience</option>
            </select>
          </label>
          <label>Display name (optional)<input name="story-name" maxLength="40" /></label>
          <label>Title<input name="story-title" required minLength="3" maxLength="80" /></label>
          <label>Story<textarea name="story-text" required minLength="10" maxLength="1200" rows="5" /></label>
          <label>Photo (optional, JPEG, PNG, WebP or GIF up to 300 KB)<input name="story-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /></label>
          <label>Video link (optional; YouTube or Vimeo)<input name="story-video" type="url" placeholder="https://youtu.be/..." /></label>
          <label className="consent-check"><input name="permission" type="checkbox" required /><span>I have permission to share the people, names, story and media in this contribution.</span></label>
          <button className="feature-button feature-button-primary" type="submit" disabled={!ready || loadFailed}>Save contribution on this device</button>
          {storyMessage && <p className="form-message" role="status">{storyMessage}</p>}
        </form>
        <div className="community-list">
          <h3>Contributions saved here ({stories.length})</h3>
          {stories.length === 0 ? <p className="empty-state">No stories or gallery items saved in this browser yet.</p> : stories.map((story) => (
            <article className="community-card" key={story.id}>
              <p className="eyebrow">{story.category}</p>
              <h3>{story.title}</h3><p>{story.text}</p>
              {story.image && <img className="community-image" src={story.image} alt={`Image shared with ${story.title}`} />}
              {story.video && <a className="text-link" href={story.video} target="_blank" rel="noreferrer">Open submitted video</a>}
              <small>{story.name} · {story.date}</small>
            </article>
          ))}
        </div>
      </section>

      <div className="board-actions">
        <p>{ready ? "Saved contributions remain in this browser until cleared." : "Loading contributions saved in this browser…"}</p>
        <button className="feature-button" type="button" onClick={clearBoard} disabled={!ready || (!loadFailed && !reviews.length && !stories.length)}>Clear this device's contributions</button>
      </div>
    </div>
  );
}
