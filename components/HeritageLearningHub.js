"use client";

import { useEffect, useState } from "react";

const FDA_ADVISORY = "https://www.fda.gov.ph/fda-advisory-no-2019-534-public-health-advisory-on-the-issue-on-alleged-methanol-poisoning-due-to-consumption-of-lambanog/";
const SAN_JUAN_HERITAGE = "https://tourism.sanjuanbatangas.gov.ph/culture-and-heritage";
const VISUAL_STEPS = [
  { title: "Coconut sap gathering", image: "/sap-collection.png", alt: "A coconut sap gatherer collecting sap from a palm", text: "Fresh sap is gathered from coconut flower blossoms. This skilled work connects Lambanog to coconut farming and local knowledge." },
  { title: "Fermentation", image: "/lambanog-fermentation.png", alt: "Coconut sap collection in a palm grove", text: "Fermentation turns the sap into tuba. Traditional knowledge helps producers understand the process and its timing." },
  { title: "Distillation", image: "/lambanog-distillation.png", alt: "Equipment used in Lambanog distillation", text: "Tuba is distilled to produce Lambanog. Responsible production requires trained handling and appropriate controls." },
  { title: "People and knowledge", image: "/traditional-production.png", alt: "A producer working with sap collection containers", text: "Farmers, sap gatherers and distillers carry knowledge that should be documented with their participation and permission." },
  { title: "Responsible packaging", image: "/lambanog-packaging.png", alt: "A packaged Lambanog product", text: "Products should be handled and labeled responsibly. Verify the specific product and follow current official safety guidance." },
];

const QUIZ = [
  {
    question: "What is Lambanog traditionally distilled from?",
    answers: ["Fermented coconut flower sap (tuba)", "Sugarcane juice", "Rice water"],
    correct: 0,
    explanation: "Lambanog is made by distilling fermented coconut flower sap, commonly called tuba.",
  },
  {
    question: "What is the best way to assess a product's safety?",
    answers: ["Assume products from one area are all the same", "Verify the specific product's current labeling and registration", "Rely on an online rumor"],
    correct: 1,
    explanation: "Safety depends on the specific product and its compliance. Check current official information.",
  },
  {
    question: "How should a visitor share a community member's story?",
    answers: ["Publish it without asking", "Get permission and check the details", "Change the person's name and publish it"],
    correct: 1,
    explanation: "Respectful storytelling requires permission and accurate context.",
  },
];

export default function HeritageLearningHub({ mode }) {
  const [tourIndex, setTourIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setLessonIndex((index) => (index + 1) % VISUAL_STEPS.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing]);

  const selectAnswer = (questionIndex, answerIndex) => {
    setAnswers((current) => ({ ...current, [questionIndex]: answerIndex }));
    setSubmitted(false);
  };

  const score = QUIZ.reduce((total, item, index) => total + (answers[index] === item.correct ? 1 : 0), 0);

  return (
    <div className="feature-stack">
      {mode === "heritage" && <>
      <section className="feature-panel" aria-labelledby="heritage-timeline-title">
        <p className="eyebrow">Roots · Local heritage</p>
        <h2 id="heritage-timeline-title">San Juan history and Lambanog heritage</h2>
        <p className="feature-intro">These dates describe the history of San Juan as recorded by the Municipal Tourism Office. They provide local context; they are not claims about when Lambanog production began.</p>
        <ol className="heritage-timeline">
          <li>
            <span className="timeline-date">1837</span>
            <h3>San Juan de Bolboc was a barrio of Rosario</h3>
            <p>The municipal history cites records from 1837 describing the settlement as a barrio administered by local deputies and comprising 17 barrios that paid tribute.</p>
          </li>
          <li>
            <span className="timeline-date">1843–1848</span>
            <h3>From Pinagbayanan to an independent municipality</h3>
            <p>The tourism account says the municipality was recognized in 1843 and became independent in 1848. Pinagbayanan was the former town site, where the church and municipal hall were built.</p>
          </li>
          <li>
            <span className="timeline-date">1855–1883</span>
            <h3>Stone church, then relocation after flooding</h3>
            <p>The church at Pinagbayanan was rebuilt in stone in 1855. After persistent flooding beginning in 1883, the town moved to its present location; the ruins remain a heritage landmark.</p>
          </li>
        </ol>
        <a className="text-link" href={SAN_JUAN_HERITAGE} target="_blank" rel="noreferrer">Source: San Juan Municipal Tourism Office — Culture and Heritage</a>
      </section>

      <section className="feature-panel" aria-labelledby="heritage-map-title">
        <p className="eyebrow">Explore the place</p>
        <h2 id="heritage-map-title">Interactive map: San Juan heritage places</h2>
        <p className="feature-intro">Use the map to find the municipal area and heritage landmarks. It does not mark private farms or distilleries, whose locations and visitor access must be confirmed directly.</p>
        <div className="map-frame">
          <iframe
            title="Map search for heritage places in San Juan, Batangas"
            src="https://maps.google.com/maps?q=Pinagbayanan%20Ruins%2C%20San%20Juan%2C%20Batangas&z=13&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Pinagbayanan%20Ruins%2C%20San%20Juan%2C%20Batangas" target="_blank" rel="noreferrer">Open Pinagbayanan Ruins in Google Maps</a>
      </section>

      <section className="feature-panel" aria-labelledby="virtual-tour-title">
        <p className="eyebrow">Branch 1 · Guided visual tour</p>
        <h2 id="virtual-tour-title">A photo tour from sap to spirit</h2>
        <p className="feature-intro">Explore the production story with project photographs and captions. This is a guided photo tour, not a 360-degree recording of a specific site.</p>
        <div className="visual-tour">
          <img src={VISUAL_STEPS[tourIndex].image} alt={VISUAL_STEPS[tourIndex].alt} />
          <div className="visual-tour-copy">
            <p className="eyebrow">Stop {tourIndex + 1} of {VISUAL_STEPS.length}</p>
            <h3>{VISUAL_STEPS[tourIndex].title}</h3>
            <p>{VISUAL_STEPS[tourIndex].text}</p>
            <div className="feature-controls">
              <button type="button" className="feature-button" onClick={() => setTourIndex((tourIndex + VISUAL_STEPS.length - 1) % VISUAL_STEPS.length)}>Previous</button>
              <button type="button" className="feature-button" onClick={() => setTourIndex((tourIndex + 1) % VISUAL_STEPS.length)}>Next stop</button>
            </div>
          </div>
        </div>
      </section>
      </>}

      {mode === "learning" && <>
      <section className="feature-panel" aria-labelledby="video-lessons-title">
        <p className="eyebrow">Branch 1 · Learn</p>
        <h2 id="video-lessons-title">Photo-based video lessons</h2>
        <p className="feature-intro">No recorded educational videos were supplied with the project. This player turns the available photographs and verified captions into a paced, video-style lesson.</p>
        <div className="lesson-player" aria-live="polite">
          <img src={VISUAL_STEPS[lessonIndex].image} alt={VISUAL_STEPS[lessonIndex].alt} />
          <div className="lesson-caption">
            <p className="eyebrow">Lesson frame {lessonIndex + 1} of {VISUAL_STEPS.length}</p>
            <h3>{VISUAL_STEPS[lessonIndex].title}</h3>
            <p>{VISUAL_STEPS[lessonIndex].text}</p>
          </div>
        </div>
        <div className="feature-controls">
          <button type="button" className="feature-button feature-button-primary" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause lesson" : "Play lesson"}</button>
          <button type="button" className="feature-button" onClick={() => { setPlaying(false); setLessonIndex(0); }}>Restart</button>
          <button type="button" className="feature-button" onClick={() => setLessonIndex((lessonIndex + 1) % VISUAL_STEPS.length)}>Next frame</button>
        </div>
      </section>

      <section className="feature-panel quiz-panel" aria-labelledby="heritage-quiz-title">
        <p className="eyebrow">Check what you learned</p>
        <h2 id="heritage-quiz-title">Lambanog heritage quiz</h2>
        {QUIZ.map((item, questionIndex) => (
          <fieldset className="quiz-question" key={item.question}>
            <legend>{questionIndex + 1}. {item.question}</legend>
            {item.answers.map((answer, answerIndex) => (
              <label key={answer}>
                <input
                  type="radio"
                  name={`quiz-${questionIndex}`}
                  checked={answers[questionIndex] === answerIndex}
                  onChange={() => selectAnswer(questionIndex, answerIndex)}
                />
                <span>{answer}</span>
              </label>
            ))}
            {submitted && <p className={answers[questionIndex] === item.correct ? "quiz-feedback correct" : "quiz-feedback"}>{answers[questionIndex] === item.correct ? "Correct. " : "Review: "}{item.explanation}</p>}
          </fieldset>
        ))}
        <button type="button" className="feature-button feature-button-primary" onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length !== QUIZ.length}>Check answers</button>
        {submitted && <p className="quiz-score" role="status">Your score: {score} out of {QUIZ.length}</p>}
      </section>
      </>}
    </div>
  );
}
