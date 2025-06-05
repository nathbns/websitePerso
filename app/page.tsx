"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

const sections = [
  { key: "a", label: "About", id: "about" },
  { key: "p", label: "Projects", id: "projects" },
  { key: "l", label: "Links", id: "links" },
];

const animatedPhrases = ["CS Student", "Lover of computers", "Use Neovim btw"];

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typing, setTyping] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Blinking cursor effect (opacity only, fixed width)
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (typing) {
      if (typedText.length < animatedPhrases[phraseIndex].length) {
        timeout = setTimeout(() => {
          setTypedText(
            animatedPhrases[phraseIndex].slice(0, typedText.length + 1)
          );
        }, 90);
      } else {
        timeout = setTimeout(() => {
          setTyping(false);
        }, 1200);
      }
    } else {
      timeout = setTimeout(() => {
        setTypedText("");
        setTyping(true);
        setPhraseIndex((i) => (i + 1) % animatedPhrases.length);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [typedText, typing, phraseIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeSection) {
        if (e.key === "a") setActiveSection("about");
        if (e.key === "p") setActiveSection("projects");
        if (e.key === "l") setActiveSection("links");
      } else {
        if (e.key === "q") handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [activeSection]);

  // Animation for terminal window
  useEffect(() => {
    if (activeSection) {
      setShowTerminal(true);
    } else {
      if (showTerminal) {
        // Delay to allow animation
        timeoutRef.current = setTimeout(() => setShowTerminal(false), 300);
      }
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeSection]);

  function handleClose() {
    setActiveSection(null);
  }

  return (
    <main className={styles.main}>
      {!activeSection ? (
        <div className={styles.splash}>
          <pre className={styles.asciiArt}>
            {`
███╗   ██╗ █████╗ ████████╗██╗  ██╗ █████╗ ███╗   ██╗
████╗  ██║██╔══██╗╚══██╔══╝██║  ██║██╔══██╗████╗  ██║
██╔██╗ ██║███████║   ██║   ███████║███████║██╔██╗ ██║
██║╚██╗██║██╔══██║   ██║   ██╔══██║██╔══██║██║╚██╗██║
██║ ╚████║██║  ██║   ██║   ██║  ██║██║  ██║██║ ╚████║
╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
`}
          </pre>
          <div className={styles.animatedTextLine}>
            <span className={styles.animatedText}>{typedText}</span>
            <span
              className={styles.blinkingCursor}
              aria-hidden="true"
              style={{ opacity: cursorVisible ? 1 : 0 }}
            >
              |
            </span>
          </div>
          <div className={styles.shortcutList}>
            {sections.map((section) => (
              <button
                key={section.id}
                className={styles.shortcutBtn}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={styles.shortcutKey}>[{section.key}]</span>{" "}
                {section.label}
              </button>
            ))}
          </div>
          <div className={styles.splashHint}>
            <span>
              Press <b>a</b>, <b>p</b>, <b>l</b> or click a button like a noob
            </span>
          </div>
        </div>
      ) : (
        <div
          className={
            showTerminal && activeSection
              ? styles.terminalWindow + " " + styles.terminalIn
              : styles.terminalWindow + " " + styles.terminalOut
          }
        >
          <div className={styles.terminalHeader}>
            <span
              className={styles.terminalDot}
              style={{ background: "#f7768e" }}
            />
            <span
              className={styles.terminalDot}
              style={{ background: "#e0af68" }}
            />
            <span
              className={styles.terminalDot}
              style={{ background: "#9ece6a" }}
            />
            <span className={styles.terminalTitle}>
              nathan@perso:~/${activeSection}
            </span>
            <button className={styles.closeBtn} onClick={handleClose}>
              [q] Quit
            </button>
          </div>
          <div className={styles.terminalContent}>
            {activeSection === "about" && (
              <div>
                <h2>About</h2>
                <p>
                  ~ 3rd year Computer Science student, passionate about software
                  development and low-level systems.
                </p>
                <p className="mt-2">
                  ~ I use Neovim btw.
                </p>
              </div>
            )}
            {activeSection === "projects" && (
              <div>
                <h2>Projects</h2>
                <ul>
                  <li>~ Game dev: doodle jump like in C/C++</li>
                  <li>~ Desktop dev: matrix solver in C++ (using Qt)</li>
                  <li>~ Http server in C</li>
                  <li>~ Other... (learning Rust btw)</li>
                </ul>
              </div>
            )}
            {activeSection === "links" && (
              <div>
                <h2>Links</h2>
                <ul>
                  <li>
                    <div className="flex flex-row items-center gap-2">
                      <p>~</p>
                      <a href="https://github.com/nathbns">GitHub</a>
                    </div>
                  </li>
                  {/* <li>
                    <a href="#">LinkedIn</a>
                  </li> */}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
